"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, GitBranch, Globe, Loader2, Upload, Plus, X, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects } from "@/lib/store";

export default function CertificatesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-24 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    }>
      <CertificatesPageContent />
    </Suspense>
  );
}

function CertificatesPageContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");
  const editId = searchParams.get("edit");

  const [user, setUser] = useState<any>(null);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [viewingCert, setViewingCert] = useState<any>(null);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [showSuggestButtons, setShowSuggestButtons] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });
      const all = await getUserProjects(authUser.id);
      setCompletedProjects(all.filter((p: any) => p.status === "completed" && (p.progress || 0) >= 100));

      if (viewId) {
        const { data: cert } = await supabase.from("certificates").select("*").eq("id", viewId).single();
        if (cert) setViewingCert(cert);
      }
      if (editId) {
        const { data: cert } = await supabase.from("certificates").select("*").eq("id", editId).single();
        if (cert) {
          setEditingCert(cert);
          setProjectName(cert.data?.projectName || "");
          setDescription(cert.data?.description || "");
          setFeatures(cert.data?.features?.length > 0 ? cert.data.features : [""]);
          setLiveUrl(cert.data?.liveUrl || "");
          setGithubUrl(cert.data?.githubUrl || "");
          setScreenshot(cert.data?.screenshot || null);
        }
      }

      setLoading(false);
    };
    init();
  }, [viewId, editId]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `public/cert-screenshot-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) { alert("Upload failed"); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setScreenshot(urlData.publicUrl);
    } catch {}
    finally { setUploading(false); }
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => {
    if (features.length <= 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  };
  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleAISuggest = async () => {
    if (!selectedProject || !projectName.trim() || !user) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate a 3-line description and 4-5 features for a project called "${projectName.trim()}". The project goal was: "${selectedProject.goal}". Format as JSON: {"description": "3-line description here", "features": ["Feature 1", "Feature 2", ...]}. Return ONLY the JSON, no other text.`,
            },
          ],
        }),
      });

      if (res.ok) {
        const text = await res.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setDescription(parsed.description || "");
          setFeatures(parsed.features?.length > 0 ? parsed.features : [""]);
          setShowSuggestButtons(true);
        }
      }
    } catch {}
    finally { setAiGenerating(false); }
  };

  const handleClearForm = () => {
    setDescription("");
    setFeatures([""]);
    setShowSuggestButtons(false);
  };

  const handleGenerateCertificate = async () => {
    if (!selectedProject || !user || !projectName.trim()) return;
    setGenerating(true);
    const finalFeatures = features.filter(f => f.trim() !== "");
    if (finalFeatures.length === 0) finalFeatures.push("Project Planning", "Implementation", "Testing", "Deployment");

    const certData = {
      id: crypto.randomUUID(),
      projectName: projectName.trim(),
      description: description.trim() || selectedProject.goal,
      features: finalFeatures,
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      screenshot: screenshot,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      userName: user.name,
      userEmail: user.email,
      projectId: selectedProject.id,
    };

    await supabase.from("certificates").insert({
      user_id: user.id,
      project_id: selectedProject.id,
      data: certData,
      created_at: new Date().toISOString(),
    });

    setCertificateData(certData);
    setGenerating(false);
  };

  const handleEditCertificate = async () => {
    if (!editingCert || !user) return;
    const updatedData = {
      ...editingCert.data,
      projectName: projectName.trim(),
      description: description.trim(),
      features: features.filter(f => f.trim() !== ""),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      screenshot: screenshot,
    };
    await supabase.from("certificates").update({ data: updatedData }).eq("id", editingCert.id);
    setCertificateData(updatedData);
    setEditingCert(null);
  };
  const handleDownload = async (certDataToDownload?: any) => {
    const data = certDataToDownload || certificateData;
    if (!data) return;
    
    // Calculate dynamic height based on description lines + features
    const descWords = (data.description || "").split(" ");
    const descLines = Math.ceil(descWords.length / 8); // ~8 words per line
    const featureCount = (data.features || []).length;
    const totalContentLines = descLines + featureCount;
    const H = Math.max(560, 200 + totalContentLines * 22 + 150);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 2;
    const W = 800;
    canvas.width = W * scale;
    canvas.height = H * scale;
    ctx.scale(scale, scale);

    // Black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // Project Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 30px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(data.projectName || "Project", W / 2, 50);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 70);
    ctx.lineTo(W - 60, 70);
    ctx.stroke();

    // Screenshot
    if (data.screenshot) {
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = data.screenshot;
        await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 25, 90, 150, 110);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.strokeRect(25, 90, 150, 110);
        }
      } catch {}
    }

    const centerX = data.screenshot ? 200 : 60;
    let yPos = 100;

    // Description heading
    ctx.fillStyle = "#eb77f1";
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Description", centerX, yPos);
    yPos += 25;

    // Description — FULL text, no truncation, dynamic wrapping
    if (data.description) {
      ctx.fillStyle = "#E0E0E0";
      ctx.font = "12px 'Manrope', sans-serif";
      
      const maxWidth = 500;
      const words = data.description.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      
      words.forEach((w: string) => {
        const testLine = currentLine ? currentLine + " " + w : w;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine.trim()) lines.push(currentLine.trim());
      
      // Draw ALL lines — no limit
      lines.forEach((line) => {
        ctx.fillText(line, centerX, yPos);
        yPos += 20;
      });
    }

    yPos += 20;

    // Features heading
    ctx.fillStyle = "#eb77f1";
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillText("Features", centerX, yPos);
    yPos += 25;

    // Features — ALL features
    (data.features || []).forEach((f: string) => {
      ctx.fillStyle = "#E0E0E0";
      ctx.font = "12px 'Manrope', sans-serif";
      
      // Wrap long features too
      const maxWidth = 500;
      const words = f.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      
      words.forEach((w: string) => {
        const testLine = currentLine ? currentLine + " " + w : w;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine.trim()) lines.push(currentLine.trim());
      
      lines.forEach((line, i) => {
        ctx.fillText(i === 0 ? "✨ " + line : line, centerX, yPos);
        yPos += 20;
      });
    });

    // Links — stacked, full URLs
    yPos += 15;
    ctx.textAlign = "center";
    ctx.font = "10px 'Manrope', sans-serif";
    
    if (data.githubUrl) {
      ctx.fillStyle = "#eb77f1";
      ctx.fillText("🔗 " + data.githubUrl, W / 2, yPos);
      yPos += 18;
    }
    if (data.liveUrl) {
      ctx.fillStyle = "#eb77f1";
      ctx.fillText("🌐 " + data.liveUrl, W / 2, yPos);
    }

    // Elsa — bottom right
    try {
      const elsaImg = new window.Image();
      elsaImg.crossOrigin = "anonymous";
      elsaImg.src = "/elsa.png";
      await new Promise((resolve) => { elsaImg.onload = resolve; elsaImg.onerror = resolve; });
      if (elsaImg.complete && elsaImg.naturalWidth > 0) {
        ctx.drawImage(elsaImg, W - 180, H - 220, 140, 180);
      }
    } catch {}

    // BloomLab — bottom left
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🌸 BloomLab", 30, H - 35);
    ctx.fillStyle = "#AAAAAA";
    ctx.font = "10px sans-serif";
    ctx.fillText(`Awarded to ${data.userName} on ${data.date}`, 30, H - 18);

    const link = document.createElement("a");
    link.download = `${(data.projectName || "certificate").replace(/\s+/g, "-")}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-24 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <Image src="/mission_complete.png" alt="Certificates" width={160} height={200} className="object-contain w-36 lg:w-44 h-auto" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  // VIEW MODE
  if (viewingCert) {
    const data = viewingCert.data;
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8"
        style={{ backgroundImage: "url('/auth-back.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10 w-full max-w-3xl">
          <Link href="/archive" className="flex items-center gap-2 text-[#6B7280] hover:text-[#312E81] mb-4 bg-white/60 backdrop-blur rounded-full px-4 py-2 border border-white/40 w-fit">
            <ArrowLeft size={18} /> Back to Archive
          </Link>
          
          <div className="rounded-[28px] border border-white/40 p-8"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(22px)", boxShadow: "0 20px 60px rgba(139,92,246,0.25)" }}>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#1E1B4B] text-center mb-6">{data.projectName}</h1>
            <div className="flex gap-6 items-start">
              {data.screenshot && (
                <div className="shrink-0">
                  <img src={data.screenshot} alt="Screenshot" className="w-44 h-36 object-cover rounded-xl" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-heading font-bold text-[#1E1B4B] text-base mb-1">Description</h3>
                {data.description && <p className="text-xs text-[#312E81] mb-4 leading-relaxed">{data.description}</p>}
                <h3 className="font-heading font-bold text-[#1E1B4B] text-base mb-2">Features</h3>
                <ul className="space-y-1.5">
                  {(data.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#312E81]"><span className="shrink-0">✨</span> {f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-6">
             {data.githubUrl && (
  <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#6B21A8] hover:underline">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    {data.githubUrl}
  </a>
)}
              {data.liveUrl && <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#6B21A8] hover:underline"><Globe size={14} /> {data.liveUrl}</a>}
            </div>
            <div className="flex justify-end items-end gap-2 mt-6">
              <div className="text-right">
                <p className="font-heading font-bold text-[#1E1B4B] text-sm">🌸 BloomLab</p>
                <p className="text-[10px] font-bold text-[#6B7280]">Awarded to {data.userName} on {data.date}</p>
              </div>
              <Image src="/elsa.png" alt="Elsa" width={65} height={80} className="object-contain" />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={() => handleDownload(data)} className="rounded-full bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-[#8B5CF6] hover:scale-105 transition shadow-lg flex items-center gap-2">
              <Download size={18} /> Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  if (editingCert) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
        <Link href="/archive" className="flex items-center gap-2 text-[#6B7280] hover:text-[#312E81] mb-6">
          <ArrowLeft size={18} /> Back to Archive
        </Link>
        <h1 className="font-heading text-xl font-bold text-[#312E81] mb-4">Edit Certificate</h1>
        <div className="space-y-3">
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none resize-none" />
          <div>
            <p className="text-xs text-[#6B7280] mb-2">Features:</p>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input type="text" value={f} onChange={(e) => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className="flex-1 rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                {features.length > 1 && <button onClick={() => removeFeature(i)} className="p-1.5 rounded-full hover:bg-red-100 text-red-400"><X size={14} /></button>}
              </div>
            ))}
            <button onClick={addFeature} className="text-xs text-[#8B5CF6] hover:underline flex items-center gap-1"><Plus size={14} /> Add feature</button>
          </div>
          <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="Live URL" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
          <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
          <div className="flex gap-3">
            <Link href="/archive" className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-4 py-2 text-xs text-[#6B7280]">Cancel</Link>
            <button onClick={handleEditCertificate} disabled={!projectName.trim()} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white">Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  // GENERATE MODE
  if (certificateData) {
    const data = certificateData;
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8"
        style={{ backgroundImage: "url('/auth-back.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10 w-full max-w-3xl">
          <Link href="/archive" className="flex items-center gap-2 text-[#6B7280] hover:text-[#312E81] mb-4 bg-white/60 backdrop-blur rounded-full px-4 py-2 border border-white/40 w-fit">
            <ArrowLeft size={18} /> Back to Archive
          </Link>
          
          <div className="rounded-[28px] border border-white/40 p-8"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(22px)", boxShadow: "0 20px 60px rgba(139,92,246,0.25)" }}>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#1E1B4B] text-center mb-6">{data.projectName}</h1>
            <div className="flex gap-6 items-start">
              {data.screenshot && (
                <div className="shrink-0">
                  <img src={data.screenshot} alt="Screenshot" className="w-44 h-36 object-cover rounded-xl" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-heading font-bold text-[#1E1B4B] text-base mb-1">Description</h3>
                {data.description && <p className="text-xs text-[#312E81] mb-4 leading-relaxed">{data.description}</p>}
                <h3 className="font-heading font-bold text-[#1E1B4B] text-base mb-2">Features</h3>
                <ul className="space-y-1.5">
                  {(data.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#312E81]"><span className="shrink-0">✨</span> {f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              {data.githubUrl && <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#6B21A8] hover:underline"><GitBranch size={14} /> {data.githubUrl}</a>}
              {data.liveUrl && <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#6B21A8] hover:underline"><Globe size={14} /> {data.liveUrl}</a>}
            </div>
            <div className="flex justify-end items-end gap-2 mt-6">
              <div className="text-right">
                <p className="font-heading font-bold text-[#1E1B4B] text-sm">🌸 BloomLab</p>
                <p className="text-[10px] text-[#6B7280]">Awarded to {data.userName} on {data.date}</p>
              </div>
              <Image src="/elsa.png" alt="Elsa" width={60} height={75} className="object-contain" />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={() => handleDownload(data)} className="rounded-full bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-[#8B5CF6] hover:scale-105 transition shadow-lg flex items-center gap-2">
              <Download size={18} /> Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: Generate Form
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
      <Link href="/archive" className="flex items-center gap-2 text-[#6B7280] hover:text-[#312E81] mb-6">
        <ArrowLeft size={18} /> Back to Archive
      </Link>
      <div className="mb-6">
        <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81]">Generate Certificate</h1>
        <p className="text-xs text-[#6B7280]">Showcase your project by generating a small overview certificate of it</p>
      </div>

      {completedProjects.length === 0 ? (
        <div className="text-center py-16">
          <Image src="/mission_complete.png" alt="Complete a project" width={140} height={160} className="object-contain w-32 lg:w-40 h-auto mx-auto mb-4" />
          <h2 className="font-heading text-lg font-bold text-[#312E81]">No completed projects yet</h2>
          <p className="text-sm text-[#6B7280] mt-1">Complete a project to generate its certificate!</p>
          <Link href="/garden" className="inline-block mt-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Garden</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completedProjects.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/40 p-5"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div><h3 className="font-heading font-semibold text-[#312E81]">{project.title}</h3><p className="text-xs text-[#6B7280]">Completed {new Date(project.created_at).toLocaleDateString()}</p></div>
                </div>
                <button onClick={() => { setSelectedProject(project); setProjectName(""); setDescription(""); setFeatures([""]); setLiveUrl(""); setGithubUrl(""); setScreenshot(null); setShowForm(true); setShowSuggestButtons(false); }}
                  className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition">Generate Certificate</button>
              </div>
              {showForm && selectedProject?.id === project.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/30 space-y-3">
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                  {/* Helper text */}
{!showSuggestButtons && (
  <p className="text-center text-[11px] text-[#6B7280] -mt-1">
    Enter project name above, then click{" "}
    <span className="text-[#8B5CF6] font-semibold">✨ Let Elsa suggest</span>{" "}
    to auto-fill the form
  </p>
)}
                  {/* AI Suggest Button */}
<button 
  onClick={handleAISuggest} 
  disabled={!projectName.trim() || aiGenerating}
  className="flex w-fit mx-auto items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#87CEEB] via-[#C4B5FD] to-[#F472B6] px-4 py-2 text-xs font-semibold text-black font-bold hover:scale-105 transition shadow-md disabled:opacity-50 disabled:hover:scale-100"
>
  {aiGenerating ? (
    <>
      <Loader2 size={14} className="animate-spin" />
      Elsa is suggesting...
    </>
  ) : (
    <>
      <Sparkles size={14} />
      Let Elsa suggest description & features
    </>
  )}
</button>

{/* Retry + Clear buttons — appear after AI suggestion */}
{showSuggestButtons && (
  <div className="flex gap-2 justify-center">
    <button 
      onClick={handleAISuggest} 
      disabled={aiGenerating}
      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#87CEEB] via-[#C4B5FD] to-[#F472B6] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition shadow-md disabled:opacity-50"
    >
      <Loader2 size={14} className={aiGenerating ? "animate-spin" : "hidden"} />
      🔄 Retry
    </button>
    <button 
      onClick={handleClearForm}
      className="flex items-center gap-1.5 rounded-xl bg-white/40 border border-[#C4B5FD]/40 px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-white/60 hover:scale-105 transition"
    >
      🗑️ Clear
    </button>
  </div>
)}
                  
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (3 lines)" rows={3} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none resize-none" />
                  
                  <div>
                    <p className="text-xs text-[#6B7280] mb-2">Features:</p>
                    {features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input type="text" value={f} onChange={(e) => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className="flex-1 rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                        {features.length > 1 && <button onClick={() => removeFeature(i)} className="p-1.5 rounded-full hover:bg-red-100 text-red-400"><X size={14} /></button>}
                      </div>
                    ))}
                    <button onClick={addFeature} className="text-xs text-[#8B5CF6] hover:underline flex items-center gap-1"><Plus size={14} /> Add feature</button>
                  </div>
                  
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="w-full rounded-full border border-dashed border-[#C4B5FD]/40 bg-white/30 px-4 py-2.5 text-xs text-[#8B5CF6] hover:bg-white/50 transition flex items-center justify-center gap-2">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {screenshot ? "Screenshot uploaded!" : "Upload Screenshot"}
                    </button>
                  </div>
                  
                  <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="Live URL" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                  <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                  
                  <div className="flex gap-3">
                    <button onClick={() => { setShowForm(false); setSelectedProject(null); }} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-4 py-2 text-xs text-[#6B7280]">Cancel</button>
                    <button onClick={handleGenerateCertificate} disabled={!projectName.trim() || generating}
                      className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center gap-2">
                      {generating ? <Loader2 size={14} className="animate-spin" /> : null}
                      {generating ? "Generating..." : "Generate Certificate"}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
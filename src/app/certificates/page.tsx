"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Loader2, Upload, Plus, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects } from "@/lib/store";

export default function CertificatesPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const viewId = searchParams.get("view");
  const editId = searchParams.get("edit");

  const [user, setUser] = useState<any>(null);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });
      const all = await getUserProjects(authUser.id);
      setCompletedProjects(all.filter((p: any) => p.status === "completed" && (p.progress || 0) >= 100));

      // If viewing or editing a specific certificate
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

  const handleDownload = (certDataToDownload?: any) => {
    const data = certDataToDownload || certificateData;
    if (!data) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = 2, W = 900, H = 580;
    canvas.width = W * scale; canvas.height = H * scale;
    ctx.scale(scale, scale);
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#87CEEB"); bgGrad.addColorStop(0.3, "#C4B5FD"); bgGrad.addColorStop(0.6, "#F472B6"); bgGrad.addColorStop(1, "#8B5CF6");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    const cardX = 40, cardY = 30, cardW = W - 80, cardH = H - 60, cardR = 28;
    ctx.beginPath();
    ctx.moveTo(cardX + cardR, cardY); ctx.lineTo(cardX + cardW - cardR, cardY);
    ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardR);
    ctx.lineTo(cardX + cardW, cardY + cardH - cardR);
    ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardR, cardY + cardH);
    ctx.lineTo(cardX + cardR, cardY + cardH);
    ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardR);
    ctx.lineTo(cardX, cardY + cardR);
    ctx.quadraticCurveTo(cardX, cardY, cardX + cardR, cardY);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#1E1B4B"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "right";
    ctx.fillText("🌸 BloomLab", cardX + cardW - 30, cardY + 40);
    const contentX = cardX + 60;
    ctx.fillStyle = "#1E1B4B"; ctx.font = "bold 32px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(data.projectName || "Project", contentX, cardY + 100);
    const badgeX = contentX, badgeY = cardY + 125, badgeW = 200, badgeH = 32;
    ctx.beginPath();
    ctx.moveTo(badgeX + 16, badgeY); ctx.lineTo(badgeX + badgeW - 16, badgeY);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + 16);
    ctx.lineTo(badgeX + badgeW, badgeY + badgeH - 16);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - 16, badgeY + badgeH);
    ctx.lineTo(badgeX + 16, badgeY + badgeH);
    ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - 16);
    ctx.lineTo(badgeX, badgeY + 16);
    ctx.quadraticCurveTo(badgeX, badgeY, badgeX + 16, badgeY);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "#22C55E"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("✓ Project Completed", badgeX + badgeW / 2, badgeY + 22);
    const featStartY = badgeY + badgeH + 40;
    (data.features || []).forEach((f: string, i: number) => {
      ctx.fillStyle = "#312E81"; ctx.font = "14px sans-serif";
      ctx.fillText("🌸 " + f, contentX, featStartY + i * 28);
    });
    const linksY = featStartY + (data.features || []).length * 28 + 20;
    if (data.githubUrl) { ctx.fillStyle = "#6B21A8"; ctx.font = "12px sans-serif"; ctx.fillText("🔗 " + data.githubUrl, contentX, linksY); }
    if (data.liveUrl) { ctx.fillText("🌐 " + data.liveUrl, contentX, linksY + (data.githubUrl ? 22 : 0)); }
    const footerY = cardY + cardH - 45;
    ctx.fillStyle = "#6B7280"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Awarded to ${data.userName} on ${data.date}`, W / 2, footerY);
    ctx.fillStyle = "#9CA3AF"; ctx.font = "11px sans-serif";
    ctx.fillText("🌸 BloomLab — Learning grows naturally.", W / 2, footerY + 20);
    const link = document.createElement("a");
    link.download = `${(data.projectName || "certificate").replace(/\s+/g, "-")}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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

  // VIEW MODE (from archive)
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
          <div className="rounded-[28px] border border-white/40 p-8 lg:p-10"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(22px)", boxShadow: "0 20px 60px rgba(139,92,246,0.25)" }}>
            <div className="flex justify-end items-start gap-2 mb-2">
              <span className="text-sm font-semibold text-[#1E1B4B] mt-2">🌸 BloomLab</span>
              <Image src="/elsa-happy-jump.png" alt="Elsa" width={80} height={100} className="object-contain -mt-4" />
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
              <div className="shrink-0">
                {data.screenshot ? (
                  <div className="relative w-48 h-36 lg:w-56 lg:h-44 rounded-2xl overflow-hidden border-2 border-white/50 shadow-lg">
                    <img src={data.screenshot} alt="Screenshot" className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -left-2 text-lg">🌸</span>
                    <span className="absolute -bottom-1 -right-1 text-lg">🌿</span>
                  </div>
                ) : (
                  <div className="w-48 h-36 lg:w-56 lg:h-44 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center text-xs text-[#6B7280]" style={{ background: "rgba(255,255,255,0.15)" }}>No screenshot</div>
                )}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#1E1B4B] mb-3">{data.projectName}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Project Completed
                </span>
                {data.description && <p className="text-xs text-[#6B7280] mb-3">{data.description}</p>}
                <ul className="space-y-2">
                  {(data.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#312E81]"><span className="text-base shrink-0">🌸</span> {f}</li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1">
                  {data.githubUrl && <a href={data.githubUrl} target="_blank" className="text-xs text-[#6B21A8] hover:underline block">🔗 {data.githubUrl}</a>}
                  {data.liveUrl && <a href={data.liveUrl} target="_blank" className="text-xs text-[#6B21A8] hover:underline block">🌐 {data.liveUrl}</a>}
                </div>
                <div className="mt-6 pt-4 border-t border-white/30">
                  <p className="text-xs text-[#6B7280]">Awarded to {data.userName} on {data.date}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">🌸 BloomLab — Learning grows naturally.</p>
                </div>
              </div>
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

  // EDIT MODE (from archive)
  if (editingCert) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
        <Link href="/archive" className="flex items-center gap-2 text-[#6B7280] hover:text-[#312E81] mb-6">
          <ArrowLeft size={18} /> Back to Archive
        </Link>
        <h1 className="font-heading text-xl font-bold text-[#312E81] mb-4">Edit Certificate</h1>
        <div className="space-y-3">
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none resize-none" />
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

  // GENERATE MODE (default - after generating shows preview)
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
          <div className="rounded-[28px] border border-white/40 p-8 lg:p-10"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(22px)", boxShadow: "0 20px 60px rgba(139,92,246,0.25)" }}>
            <div className="flex justify-end items-start gap-2 mb-2">
              <span className="text-sm font-semibold text-[#1E1B4B] mt-2">🌸 BloomLab</span>
              <Image src="/elsa-happy-jump.png" alt="Elsa" width={80} height={100} className="object-contain -mt-4" />
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
              <div className="shrink-0">
                {data.screenshot ? (
                  <div className="relative w-48 h-36 lg:w-56 lg:h-44 rounded-2xl overflow-hidden border-2 border-white/50 shadow-lg">
                    <img src={data.screenshot} alt="Screenshot" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-36 lg:w-56 lg:h-44 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center text-xs text-[#6B7280]" style={{ background: "rgba(255,255,255,0.15)" }}>No screenshot</div>
                )}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#1E1B4B] mb-3">{data.projectName}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-3" style={{ background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Project Completed
                </span>
                {data.description && <p className="text-xs text-[#6B7280] mb-3">{data.description}</p>}
                <ul className="space-y-2">
                  {(data.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#312E81]"><span className="text-base shrink-0">🌸</span> {f}</li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1">
                  {data.githubUrl && <a href={data.githubUrl} target="_blank" className="text-xs text-[#6B21A8] hover:underline block">🔗 {data.githubUrl}</a>}
                  {data.liveUrl && <a href={data.liveUrl} target="_blank" className="text-xs text-[#6B21A8] hover:underline block">🌐 {data.liveUrl}</a>}
                </div>
                <div className="mt-6 pt-4 border-t border-white/30">
                  <p className="text-xs text-[#6B7280]">Awarded to {data.userName} on {data.date}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">🌸 BloomLab — Learning grows naturally.</p>
                </div>
              </div>
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
                <button onClick={() => { setSelectedProject(project); setProjectName(""); setDescription(""); setFeatures([""]); setLiveUrl(""); setGithubUrl(""); setScreenshot(null); setShowForm(true); }}
                  className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition">Generate Certificate</button>
              </div>
              {showForm && selectedProject?.id === project.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-white/30 space-y-3">
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name *" className="w-full rounded-full border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={2} className="w-full rounded-2xl border border-white/40 bg-white/50 backdrop-blur px-4 py-2 text-sm text-[#312E81] outline-none resize-none" />
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
                      className="w-full rounded-full border border-dashed border-[#C4B5FD]/40 bg-white/30 px-4 py-2.5 text-xs text-[#8B5CF6] hover:bg-white/50 transition flex items-center gap-2">
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
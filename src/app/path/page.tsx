"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserProjects, getProjectSkills } from "@/lib/store";

export default function SkillMapPage() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const loadSkills = useCallback(async (projectId: string) => {
    const skillsData = await getProjectSkills(projectId);
    setSkills(skillsData);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single();
      setUser(profile || { name: authUser.email?.split("@")[0] || "Bloomer" });

      if (profile) {
        const userProjects = await getUserProjects(profile.id);
        const activeProjects = userProjects.filter((p: any) => p.status === "active");
        setProjects(activeProjects);

        if (activeProjects.length > 0) {
          setSelectedProject(activeProjects[0]);
          await loadSkills(activeProjects[0].id);
        }
      }
      setLoading(false);
    };
    init();
  }, [loadSkills]);

  const handleProjectChange = async (project: any) => {
    setSelectedProject(project);
    setShowProjectPicker(false);
    await loadSkills(project.id);
  };

  const remainingSkills = skills.filter((s) => s.status === "locked").length;
  const completedSkills = skills.filter((s) => s.status === "completed").length;
  const daysLeft = remainingSkills * 3;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl">🌸</motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
        <span className="text-6xl">🔒</span>
        <h2 className="font-heading text-2xl font-bold text-[#312E81]">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FFF5F5 30%, #EDE9FE 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/garden" className="text-[#6B7280] hover:text-[#312E81] transition"><ArrowLeft size={22} /></Link>
            <div>
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81]">Skill Map</h1>
              <p className="text-xs text-[#6B7280]">Your personalized learning path</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#6B7280]" />
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60">
              <Image src="/idle.png" alt="Profile" fill className="object-cover" />
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/40 p-8 text-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            <Image src="/showel.png" alt="Build your skills" width={160} height={180} className="object-contain mx-auto" />
            <h3 className="font-heading text-xl font-bold text-[#312E81] mt-4">Create a project to see your skill map</h3>
            <p className="text-sm text-[#6B7280] mt-1 max-w-md mx-auto">
              Once you create a project, Elsa will generate a personalized learning path just for you!
            </p>
            <Link href="/garden" className="inline-block mt-5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition">
              Go to Garden →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Project Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="rounded-2xl border border-white/40 p-6"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
                
                {/* Project Selector */}
                <div className="relative mb-4">
                  <button onClick={() => setShowProjectPicker(!showProjectPicker)}
                    className="w-full flex items-center justify-between rounded-xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-semibold text-[#312E81] hover:bg-white/60 transition">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🚀</span> {selectedProject?.title || "Select Project"}
                    </span>
                    <ChevronDown size={16} className={showProjectPicker ? "rotate-180" : ""} />
                  </button>
                  {showProjectPicker && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl z-20 overflow-hidden">
                      {projects.map((p) => (
                        <button key={p.id} onClick={() => handleProjectChange(p)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#8B5CF6]/10 transition ${
                            selectedProject?.id === p.id ? "bg-[#8B5CF6]/10 text-[#8B5CF6] font-semibold" : "text-[#312E81]"
                          }`}>
                          🚀 {p.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedProject && (
                  <>
                    <span className="text-4xl">🚀</span>
                    <h2 className="font-heading text-xl font-bold text-[#312E81] mt-3">{selectedProject.title}</h2>
                    <p className="text-sm text-[#6B7280] mt-1">{selectedProject.goal}</p>

                    <div className="mt-6">
                      <p className="text-3xl font-bold text-[#312E81]">{selectedProject.progress || 0}%</p>
                      <p className="text-xs text-[#6B7280]">Overall Progress</p>
                      <div className="mt-2 h-2.5 bg-[#C4B5FD]/30 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress || 0}%` }}
                          transition={{ duration: 1 }} />
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 text-sm">
                      <p className="text-[#6B7280]">
                        <span className="font-semibold text-[#312E81]">Skills completed:</span> {completedSkills}/{skills.length}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-semibold text-[#312E81]">Estimated days left:</span> {daysLeft} days
                      </p>
                    </div>

                    <Link href={`/projects/${selectedProject.id}`}
                      className="mt-6 block w-full text-center rounded-full border border-[#C4B5FD]/40 bg-white/40 backdrop-blur px-4 py-2.5 text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition">
                      Change Goal
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right — Skill Nodes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
              <div className="rounded-2xl border border-white/40 p-6 lg:p-8"
                style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.08)" }}>
                
                {skills.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-5xl">🗺️</span>
                    <p className="font-heading font-semibold text-[#312E81] mt-4">Skills being generated...</p>
                    <p className="text-sm text-[#6B7280] mt-1">Elsa is analyzing your project to create a personalized learning path.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {skills.map((skill, index) => (
                      <div key={skill.id} className="relative">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.15 }}
                          className="flex items-center gap-5 mb-2">
                          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all ${
                            skill.status === "completed" ? "bg-emerald-400 border-emerald-500 text-white" :
                            skill.status === "active" ? "bg-[#8B5CF6] border-[#A78BFA] text-white ring-4 ring-[#C4B5FD]/40 animate-pulse" :
                            "bg-gray-200 border-gray-300 text-gray-400"
                          }`}>
                            {skill.status === "completed" ? "✓" : skill.status === "active" ? "●" : "🔒"}
                          </div>
                          <div className="flex-1">
                            <p className={`font-heading font-semibold ${skill.status === "locked" ? "text-[#6B7280]/50" : "text-[#312E81]"}`}>
                              {skill.name}
                            </p>
                            <p className="text-xs text-[#6B7280]">{skill.description}</p>
                            {skill.status === "active" && (
                              <span className="inline-block mt-1 rounded-full bg-[#8B5CF6]/10 px-3 py-0.5 text-xs font-semibold text-[#8B5CF6]">Today</span>
                            )}
                            {skill.status === "completed" && (
                              <span className="inline-block mt-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">Completed</span>
                            )}
                          </div>
                          {skill.status === "active" && (
                            <Link href="/learn" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition whitespace-nowrap">
                              Start Lesson →
                            </Link>
                          )}
                        </motion.div>
                        {index < skills.length - 1 && (
                          <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-[#C4B5FD] to-[#C4B5FD]/30" />
                        )}
                      </div>
                    ))}

                    {/* Final Goal */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4 ml-16">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#F472B6]/40 px-4 py-2.5"
                        style={{ background: "rgba(244,114,182,0.08)" }}>
                        <span className="text-lg">🏁</span>
                        <span className="text-sm font-semibold text-[#EC4899]">Build Your {selectedProject?.title || "Project"}!</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
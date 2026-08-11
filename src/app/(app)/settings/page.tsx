"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, Bell, Trash2, Upload, X } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [notifications, setNotifications] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/idle.png");
  const [uploading, setUploading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      setUser(authUser);
      const { data: profile } = await supabase.from("users").select("avatar_url, daily_goal").eq("id", authUser.id).single();
      if (profile?.daily_goal) setDailyGoal(profile.daily_goal);
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      setLoading(false);
    };
    init();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `public/avatar.${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl + "?v=" + Date.now());
      setAvatarKey(prev => prev + 1);
      await supabase.from("users").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
    } catch (err: any) { alert("Something went wrong"); }
    finally { setUploading(false); }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setAvatarUrl("/idle.png");
    setAvatarKey(prev => prev + 1);
    await supabase.from("users").update({ avatar_url: null }).eq("id", user.id);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await supabase.from("users").delete().eq("id", user.id);
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) { alert("Failed to delete account."); }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">{[...Array(4)].map((_,i)=><div key={i} className="h-16 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <img src="/pose8.png" alt="Settings" className="w-36 lg:w-44 h-auto object-contain" />
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 lg:px-8 py-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#312E81]">Settings</h1>
        <p className="text-xs text-[#6B7280] mt-1">Manage your preferences</p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white/60 shadow-xl mb-3">
          <img key={avatarKey} src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        <p className="font-semibold text-[#312E81] text-sm">{user.email}</p>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:underline font-semibold"><Upload size={14} /> Upload</button>
          {avatarUrl && !avatarUrl.includes("idle.png") && (
            <button onClick={handleRemovePhoto} className="flex items-center gap-1.5 text-xs text-red-500 hover:underline font-semibold"><X size={14} /> Remove</button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/40 p-4" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="text-lg">🎯</span><div><h3 className="font-heading font-semibold text-[#312E81] text-sm">Daily Goal</h3><p className="text-[11px] text-[#6B7280]">{dailyGoal} min/day</p></div></div>
            <select 
              value={dailyGoal} 
              onChange={async (e) => {
                const val = Number(e.target.value);
                setDailyGoal(val);
                await supabase.from("users").update({ daily_goal: val }).eq("id", user.id);
              }} 
              className="rounded-full border border-white/40 bg-white/50 backdrop-blur px-3 py-1.5 text-xs text-[#312E81] outline-none cursor-pointer">
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 p-4" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Bell size={18} className="text-[#6B7280]" /><div><h3 className="font-heading font-semibold text-[#312E81] text-sm">Notifications</h3><p className="text-[11px] text-[#6B7280]">Email reminders</p></div></div>
            <button onClick={() => setNotifications(!notifications)} className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${notifications ? "bg-[#8B5CF6]" : "bg-gray-300"}`}>
              <motion.div animate={{ x: notifications ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 p-4" style={{ background: "rgba(255,200,200,0.10)", backdropFilter: "blur(14px)" }}>
          <h3 className="font-heading font-semibold text-red-500 text-sm mb-2">Danger Zone</h3>
          <button onClick={() => setShowDelete(true)} className="rounded-full border border-red-200 bg-white/40 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition flex items-center gap-2"><Trash2 size={14} /> Delete Account</button>
        </div>

        <div className="flex justify-center pt-2">
          <button onClick={() => setShowLogout(true)} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-[#312E81] hover:bg-white/40 transition active:scale-[0.98]" style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 4px 16px rgba(139,92,246,0.04)" }}><LogOut size={16} /> Log Out</button>
        </div>
      </div>

      <AnimatePresence>{showLogout && <ConfirmModal icon="👋" title="Ready to leave?" text="You'll be signed out." onCancel={() => setShowLogout(false)} onConfirm={handleLogout} confirmText="Log Out" />}</AnimatePresence>
      <AnimatePresence>{showDelete && <ConfirmModal icon="🗑️" title="Delete Account?" text="This is permanent." onCancel={() => setShowDelete(false)} onConfirm={handleDeleteAccount} confirmText="Delete" danger />}</AnimatePresence>
    </div>
  );
}

function ConfirmModal({ icon, title, text, onCancel, onConfirm, confirmText, danger }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="rounded-2xl border border-white/40 p-6 w-full max-w-sm text-center bg-white/90 backdrop-blur-xl" style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
        <span className="text-4xl">{icon}</span>
        <h3 className="font-heading font-bold text-[#312E81] mt-3">{title}</h3>
        <p className="text-sm text-[#6B7280] mt-1">{text}</p>
        <div className="flex gap-3 justify-center mt-5">
          <button onClick={onCancel} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
          <button onClick={onConfirm} className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${danger ? "bg-red-400 hover:bg-red-500" : "bg-red-400 hover:bg-red-500"}`}>{confirmText}</button>
        </div>
      </motion.div>
    </div>
  );
}
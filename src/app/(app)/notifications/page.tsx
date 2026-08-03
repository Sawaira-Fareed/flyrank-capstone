"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const typeColors: Record<string, string> = {
  achievement: "bg-amber-100",
  learning: "bg-purple-100",
  mentor: "bg-emerald-100",
  reminder: "bg-orange-100",
  project: "bg-blue-100",
  system: "bg-gray-100",
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      setUser(authUser);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setNotifs(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const markOneRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = filter === "unread" ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
        <div className="h-8 bg-white/20 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-2">{[...Array(4)].map((_,i)=><div key={i} className="h-16 bg-white/15 rounded-2xl animate-pulse"/>)}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-4">
        <span className="text-5xl">🔔</span>
        <h2 className="font-heading text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#312E81]">Notifications</h1>
          <p className="text-xs text-[#6B7280]">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-[#8B5CF6] hover:underline font-semibold">Mark all read</button>
          )}
          <div className="flex gap-1 bg-white/20 backdrop-blur rounded-full p-1">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === f ? "bg-white text-[#8B5CF6] shadow-sm" : "text-[#6B7280] hover:text-[#312E81]"}`}>
                {f === "all" ? "All" : "Unread"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🔔</span>
          <p className="font-heading font-semibold text-[#312E81] mt-4">All caught up!</p>
          <p className="text-sm text-[#6B7280] mt-1">
            {notifs.length === 0 ? "Notifications will appear here when you complete lessons, earn badges, and more." : "No unread notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => (
            <motion.div key={notif.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => !notif.read && markOneRead(notif.id)}
              className={`rounded-2xl border border-white/40 p-4 flex items-start gap-3 cursor-pointer transition ${!notif.read ? "bg-white/40" : "bg-white/20"}`}
              style={{ backdropFilter: "blur(14px)" }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${typeColors[notif.type] || "bg-gray-100"}`}>
                {notif.icon || "🔔"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-sm text-[#312E81]">{notif.title}</h3>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />}
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-[#6B7280]/60 mt-1">{timeAgo(notif.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
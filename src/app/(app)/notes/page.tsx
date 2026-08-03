"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Plus, Trash2, Edit3, MoreHorizontal, X, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getUserNotes, createNote, updateNote, deleteNote } from "@/lib/store";

export default function NotesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"view" | "edit" | "create" | "idle">("idle");
  const [showDelete, setShowDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }
      setUser(authUser);
      try { setNotes(await getUserNotes(authUser.id)); }
      catch { setError("Failed to load notes."); }
      setLoading(false);
    };
    init();
  }, []);

  const loadNotes = async () => { if (!user) return; setNotes(await getUserNotes(user.id)); };

  const handleCreate = () => { setSelectedNote(null); setTitle(""); setContent(""); setMode("create"); setError(""); };

  const handleSelectNote = (note: any) => { setSelectedNote(note); setTitle(note.title); setContent(note.content || ""); setMode("view"); setShowMenu(false); setError(""); };

  const handleEdit = () => { setMode("edit"); setShowMenu(false); };

  const handleClose = () => { setSelectedNote(null); setTitle(""); setContent(""); setMode("idle"); setError(""); };

  const handleSave = async () => {
    if (!user || !title.trim()) return;
    setSaving(true); setError("");
    try {
      if (selectedNote) { await updateNote(selectedNote.id, { title: title.trim(), content }); }
      else { const n = await createNote(user.id, title.trim(), content); if (n) setSelectedNote(n); }
      await loadNotes();
      setMode("view");
    } catch { setError("Failed to save note."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    try { await deleteNote(selectedNote.id); setSelectedNote(null); setTitle(""); setContent(""); setMode("idle"); setShowDelete(false); setShowMenu(false); await loadNotes(); }
    catch { setError("Failed to delete note."); }
  };

  const filtered = notes.filter((n) => !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase()));
  const isEditing = mode === "edit" || mode === "create";

  if (loading) {
    return (
      <div className="px-2 lg:px-8 py-4 lg:py-6 w-full overflow-x-hidden">
        <div className="h-7 bg-white/20 rounded w-32 mb-4 animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-72 h-80 bg-white/15 rounded-2xl animate-pulse" />
          <div className="flex-1 h-80 bg-white/15 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 px-4">
        <img src="/pose12.png" alt="Notes" className="w-32 lg:w-44 h-auto object-contain" />
        <h2 className="font-heading text-lg lg:text-xl font-bold text-[#312E81] text-center">Please log in</h2>
        <Link href="/login" className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-5 py-2 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="px-2 lg:px-8 py-4 lg:py-6 w-full overflow-x-hidden">
      <div className="mb-4 lg:mb-6">
        <h1 className="font-heading text-lg lg:text-2xl font-bold text-[#312E81]">Notes</h1>
        <p className="text-[11px] lg:text-xs text-[#6B7280]">Your personal knowledge base</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left — Note List */}
        <div className="lg:w-72 shrink-0">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex-1 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/30 backdrop-blur-md px-3 py-2">
              <Search size={14} className="text-[#6B7280] shrink-0" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 min-w-0 bg-transparent text-xs text-[#312E81] outline-none placeholder:text-[#6B7280]/60" />
            </div>
            <button onClick={handleCreate} className="shrink-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] p-2 text-white hover:scale-105 transition"><Plus size={16} /></button>
          </div>
          <div className="space-y-1.5 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center py-8">
                <img src="/pose12.png" alt="No notes" className="w-16 lg:w-20 h-auto mx-auto mb-2 object-contain opacity-60" />
                <p className="text-[11px] lg:text-xs text-[#6B7280]">{search ? "No matches." : "No notes yet. Create one!"}</p>
              </div>
            )}
            {filtered.map((note) => (
              <motion.div key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => handleSelectNote(note)}
                className={`rounded-xl border border-white/40 p-2.5 lg:p-3 cursor-pointer transition ${selectedNote?.id === note.id ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/40" : ""}`}
                style={{ background: selectedNote?.id === note.id ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)" }}>
                <h3 className="font-heading font-semibold text-[#312E81] text-[11px] lg:text-sm truncate">{note.title || "Untitled"}</h3>
                <p className="text-[10px] lg:text-xs text-[#6B7280] mt-0.5 line-clamp-2">{note.content || ""}</p>
                <p className="text-[9px] text-[#6B7280]/60 mt-1">{new Date(note.updated_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Editor / Viewer */}
        <div className="flex-1">
          <div className="rounded-2xl border border-white/40 p-4 lg:p-5 relative"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(14px)", boxShadow: "0 8px 24px rgba(139,92,246,0.06)" }}>
            
            {/* Three-dot menu — only in view mode */}
            {mode === "view" && selectedNote && (
              <div className="absolute top-3 right-3">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full hover:bg-white/40 transition">
                  <MoreHorizontal size={18} className="text-[#6B7280]" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 w-36 rounded-xl border border-white/40 bg-white/90 backdrop-blur-xl shadow-lg z-10 overflow-hidden">
                    <button onClick={handleEdit} className="w-full text-left px-4 py-2.5 text-xs text-[#312E81] hover:bg-[#8B5CF6]/10 flex items-center gap-2"><Edit3 size={13} /> Edit</button>
                    <button onClick={() => { setShowDelete(true); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={13} /> Delete</button>
                    <button onClick={handleClose} className="w-full text-left px-4 py-2.5 text-xs text-[#6B7280] hover:bg-gray-50 flex items-center gap-2"><X size={13} /> Close</button>
                  </div>
                )}
              </div>
            )}

            {isEditing ? (
              /* EDIT / CREATE MODE */
              <>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." className="w-full text-base lg:text-lg font-heading font-bold text-[#312E81] bg-transparent outline-none placeholder:text-[#6B7280]/40 mb-3" />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing..." rows={10} className="w-full text-sm text-[#312E81] bg-transparent outline-none placeholder:text-[#6B7280]/40 resize-none leading-7" />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/30">
                  <p className="text-[10px] lg:text-xs text-[#6B7280]">{mode === "create" ? "New note" : "Editing"}</p>
                  <div className="flex gap-2">
                    <button onClick={handleClose} className="rounded-full border border-[#C4B5FD]/40 bg-white/40 px-3 py-1.5 text-[10px] lg:text-xs font-semibold text-[#6B7280] hover:bg-white/60 transition">Cancel</button>
                    <button onClick={handleSave} disabled={!title.trim() || saving} className="rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-1.5 text-[10px] lg:text-xs font-semibold text-white hover:scale-105 transition disabled:opacity-50 flex items-center gap-1"><Save size={13} /> {saving ? "Saving..." : "Save"}</button>
                  </div>
                </div>
              </>
            ) : mode === "view" && selectedNote ? (
              /* VIEW MODE */
              <>
                <h2 className="font-heading text-lg lg:text-xl font-bold text-[#312E81] mb-2">{selectedNote.title || "Untitled"}</h2>
                <p className="text-[10px] lg:text-xs text-[#6B7280] mb-4">Last updated: {new Date(selectedNote.updated_at).toLocaleDateString()}</p>
                <div className="text-sm text-[#312E81] leading-7 whitespace-pre-wrap">{selectedNote.content || "No content."}</div>
              </>
            ) : (
              /* IDLE — no note selected */
              <div className="text-center py-10 lg:py-14">
                <img src="/pose12.png" alt="Take notes" className="w-20 lg:w-28 h-auto mx-auto mb-3 object-contain" />
                <h3 className="font-heading text-base lg:text-lg font-bold text-[#312E81]">Select a note or create one</h3>
                <p className="text-[11px] lg:text-xs text-[#6B7280] mt-1">Your notes sync across lessons and projects.</p>
                <button onClick={handleCreate} className="mt-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-4 py-2 text-[11px] lg:text-xs font-semibold text-white hover:scale-105 transition inline-flex items-center gap-1.5"><Plus size={14} /> New Note</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl border border-white/40 p-6 w-full max-w-sm text-center bg-white/90 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 60px rgba(139,92,246,0.15)" }}>
              <span className="text-4xl">🗑️</span>
              <h3 className="font-heading font-bold text-[#312E81] mt-3">Delete Note?</h3>
              <p className="text-sm text-[#6B7280] mt-1">This cannot be undone.</p>
              <div className="flex gap-3 justify-center mt-5">
                <button onClick={() => setShowDelete(false)} className="rounded-full border border-[#C4B5FD]/40 bg-white/50 px-5 py-2.5 text-sm text-[#6B7280]">Cancel</button>
                <button onClick={handleDelete} className="rounded-full bg-red-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
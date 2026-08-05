import { createClient } from "@/utils/supabase/client";

// ============================================================
// BloomLab Supabase Store
// ============================================================

export interface Project {
  id: string;
  title: string;
  goal: string;
  progress: number;
  current_day: number;
  total_days: number;
  status: string;
  created_at: string;
}

export interface Skill {
  id: string;
  project_id: string;
  name: string;
  description: string;
  days: number;
  status: "completed" | "active" | "locked";
  sort_order: number;
}

// Get or create user
export async function getOrCreateUser(email: string, name: string) {
  const supabase = createClient();
  
  // Check if user exists
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) {
    // Update streak
    const today = new Date().toDateString();
    const lastActive = new Date(existing.last_active).toDateString();
    if (lastActive !== today) {
      await supabase
        .from("users")
        .update({ streak: existing.streak + 1, last_active: today })
        .eq("id", existing.id);
    }
    return existing;
  }

  // Create new user
  const { data: newUser } = await supabase
    .from("users")
    .insert({ email, name })
    .select()
    .single();

  return newUser;
}

// Get user's projects
export async function getUserProjects(userId: string): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}

// Create a new project
// Create a new project
export async function createProject(userId: string, goal: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: goal,
      goal,
      progress: 0,
      current_day: 1,
      total_days: 30,
      status: "active",
    })
    .select()
    .single();
  
  if (error) {
    console.error("Failed to create project:", error);
    return null;
  }
  
  return data;
}
// Get skills for a project
export async function getProjectSkills(projectId: string): Promise<Skill[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  return data || [];
}

// Save skills for a project (from AI response)
export async function saveProjectSkills(projectId: string, skills: Omit<Skill, "id" | "project_id">[]) {
  const supabase = createClient();
  const rows = skills.map((skill, index) => ({
    project_id: projectId,
    name: skill.name,
    description: skill.description,
    days: skill.days,
    status: skill.status,
    sort_order: index,
  }));
  const { error } = await supabase.from("skills").insert(rows);
  return !error;
}

// Update project progress
export async function updateProjectProgress(projectId: string, progress: number, currentDay: number) {
  const supabase = createClient();
  await supabase
    .from("projects")
    .update({ progress, current_day: currentDay })
    .eq("id", projectId);
}

export async function getUserStats(userId: string) {
  const supabase = createClient();
  const { data: user } = await supabase.from("users").select("streak, xp").eq("id", userId).single();
  const { count: lessonsCount } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: completedLessons } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("completed", true);
  const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId);
  return {
    streak: user?.streak || 0,
    xp: user?.xp || 0,
    lessons: lessonsCount || 0,
    completedLessons: completedLessons || 0,
    projects: projectsCount || 0,
  };
}
// ============================================================
// NOTES
// ============================================================

export async function getUserNotes(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return data || [];
}

export async function createNote(userId: string, title: string, content: string = "") {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .insert({ user_id: userId, title, content })
    .select()
    .single();
  return data;
}

export async function updateNote(noteId: string, updates: { title?: string; content?: string; is_favorite?: boolean }) {
  const supabase = createClient();
  await supabase.from("notes").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", noteId);
}

export async function deleteNote(noteId: string) {
  const supabase = createClient();
  await supabase.from("notes").delete().eq("id", noteId);
}

export async function searchNotes(userId: string, query: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("updated_at", { ascending: false });
  return data || [];
}

// ============================================================
// BOOKMARKS / RESOURCES
// ============================================================

export async function getUserBookmarks(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function addBookmark(userId: string, bookmark: { title: string; description?: string; url?: string; type?: string }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, ...bookmark })
    .select()
    .single();
  return data;
}

export async function deleteBookmark(bookmarkId: string) {
  const supabase = createClient();
  await supabase.from("bookmarks").delete().eq("id", bookmarkId);
}

// ============================================================
// USER BADGES
// ============================================================

export async function getUserBadges(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });
  return data || [];
}

// ============================================================
// ARCHIVE DATA (all in one call)
// ============================================================

export async function getArchiveData(userId: string) {
  const supabase = createClient();
  
  const [lessonsRes, projectsRes, badgesRes, notesRes, bookmarksRes, statsRes] = await Promise.all([
    supabase.from("lessons").select("*").eq("user_id", userId).eq("completed", true).order("completed_at", { ascending: false }),
    supabase.from("projects").select("*").eq("user_id", userId).eq("status", "completed").order("created_at", { ascending: false }),
    supabase.from("user_badges").select("*").eq("user_id", userId).order("earned_at", { ascending: false }),
    supabase.from("notes").select("*").eq("user_id", userId).order("updated_at", { ascending: false }),
    supabase.from("bookmarks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("users").select("streak").eq("id", userId).single(),
  ]);

  // Counts
  const { count: completedLessons } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: completedProjects } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "completed");

  return {
    lessons: lessonsRes.data || [],
    projects: projectsRes.data || [],
    badges: badgesRes.data || [],
    notes: notesRes.data || [],
    bookmarks: bookmarksRes.data || [],
    stats: {
      completedLessons: completedLessons || 0,
      completedProjects: completedProjects || 0,
      certificates: 0,
      hoursLearned: Math.floor((completedLessons || 0) * 0.25),
    },
  };
}
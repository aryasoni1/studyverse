import { supabase } from "@/lib/supabase";

// --- NOTES ---
// TODO: Replace { [key: string]: unknown } with specific types for each content type
export async function fetchNotes() {
  // Fetch notes with full author profile
  const { data, error } = await supabase
    .from("notes")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createNote(
  note: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  // Create a note with author reference
  const { data, error } = await supabase
    .from("notes")
    .insert([note])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// --- ROADMAPS ---
export async function fetchRoadmaps() {
  const { data, error } = await supabase
    .from("roadmaps")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createRoadmap(
  roadmap: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("roadmaps")
    .insert([roadmap])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// --- TASKS ---
export async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createTask(
  task: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([task])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// --- RESOURCES (Free/Paid) ---
export async function fetchResources(isPaid: boolean) {
  // Assumes a 'resources' table with 'is_paid' boolean and 'user_id' foreign key
  const { data, error } = await supabase
    .from("resources")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .eq("is_paid", isPaid)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createResource(
  resource: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("resources")
    .insert([resource])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// --- EXPLANATIONS & SUMMARIES ---
export async function fetchExplanations() {
  // Assumes an 'explanations' table with 'user_id' foreign key
  const { data, error } = await supabase
    .from("explanations")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createExplanation(
  explanation: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("explanations")
    .insert([explanation])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

export async function fetchSummaries() {
  // Assumes a 'summaries' table with 'user_id' foreign key
  const { data, error } = await supabase
    .from("summaries")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createSummary(
  summary: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("summaries")
    .insert([summary])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// --- FLASHCARDS ---
export async function fetchFlashcards() {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createFlashcard(
  flashcard: Omit<{ [key: string]: unknown }, "id" | "created_at"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("flashcards")
    .insert([flashcard])
    .select("*, author:profiles(id, full_name, avatar_url)")
    .single();
  return { data, error };
}

// Defensive coding: Always check for null/undefined author in UI components using this API.

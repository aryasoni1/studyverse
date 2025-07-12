export interface Notebook {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  notes_count?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  notebook_id?: string;
  user_id: string;
  tags: string[];
  skill_id?: string;
  is_public: boolean;
  is_favorite: boolean;
  word_count: number;
  reading_time: number;
  ai_enabled: boolean;
  created_at: string;
  updated_at: string;
  notebook?: Notebook;
  author?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  icon: string;
}

export interface AIInsight {
  id: string;
  note_id: string;
  type: "summary" | "quiz" | "explanation" | "connection" | "suggestion";
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface NotesState {
  notebooks: Notebook[];
  notes: Note[];
  currentNote: Note | null;
  selectedNotebook: string | null;
  searchQuery: string;
  selectedTags: string[];
  sortBy: "updated" | "created" | "title" | "size";
  sortOrder: "asc" | "desc";
  viewMode: "list" | "grid" | "compact";
  loading: boolean;
  error: string | null;
  aiInsights: AIInsight[];
  templates: NoteTemplate[];
}

export interface CreateNoteData {
  title: string;
  content?: string;
  notebook_id?: string;
  tags?: string[];
  ai_enabled?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  notebook_id?: string;
  tags?: string[];
  is_favorite?: boolean;
  ai_enabled?: boolean;
}

export interface NotesFilter {
  notebook_id?: string;
  tags?: string[];
  search?: string;
  is_favorite?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  history: string[];
  historyIndex: number;
  isModified: boolean;
  lastSaved: string;
}

export interface YouTubeTranscript {
  id: string;
  video_id: string;
  title: string;
  transcript: Array<{
    start: number;
    duration: number;
    text: string;
  }>;
  summary?: string;
  key_points?: string[];
  created_at: string;
}

import { supabase } from "@/lib/supabase";
import type {
  Note,
  Notebook,
  CreateNoteData,
  UpdateNoteData,
  NotesFilter,
  AIInsight,
  YouTubeTranscript,
} from "../types/notesTypes";

// Mock data for demo mode
const mockNotebooks: Notebook[] = [
  {
    id: "1",
    name: "Programming Notes",
    description: "Notes about programming concepts and tutorials",
    color: "#7C3AED",
    is_default: false,
    user_id: "current-user",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes_count: 5,
  },
  {
    id: "2",
    name: "Design Concepts",
    description: "UI/UX design principles and inspiration",
    color: "#3B82F6",
    is_default: false,
    user_id: "current-user",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes_count: 3,
  },
  {
    id: "3",
    name: "My Notes",
    description: "Default notebook for your notes",
    color: "#10B981",
    is_default: true,
    user_id: "current-user",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes_count: 8,
  },
];

const mockNotes: Note[] = [
  {
    id: "1",
    title: "JavaScript Closures",
    content:
      "Closures are functions that have access to variables from an outer function scope, even after the outer function has returned. They're created every time a function is created, at function creation time.\n\n```javascript\nfunction makeCounter() {\n  let count = 0;\n  return function() {\n    return count++;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 0\nconsole.log(counter()); // 1\n```\n\nThis is useful for data encapsulation and creating private variables.",
    notebook_id: "1",
    user_id: "current-user",
    tags: ["javascript", "programming", "functions"],
    is_public: false,
    is_favorite: true,
    word_count: 85,
    reading_time: 1,
    ai_enabled: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notebook: mockNotebooks[0],
  },
  {
    id: "2",
    title: "React Hooks Overview",
    content:
      "React Hooks are functions that let you use state and other React features without writing a class component.\n\nCommon hooks include:\n\n- useState: For managing state\n- useEffect: For side effects\n- useContext: For accessing context\n- useReducer: For complex state logic\n- useCallback and useMemo: For performance optimizations\n\n```jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  });\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```",
    notebook_id: "1",
    user_id: "current-user",
    tags: ["react", "javascript", "hooks", "frontend"],
    is_public: true,
    is_favorite: true,
    word_count: 120,
    reading_time: 2,
    ai_enabled: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notebook: mockNotebooks[0],
  },
  {
    id: "3",
    title: "Color Theory Basics",
    content:
      "# Color Theory Basics\n\nColor theory is the collection of rules and guidelines which designers use to communicate with users through appealing color schemes in visual interfaces.\n\n## Primary Colors\n\n- Red\n- Blue\n- Yellow\n\n## Secondary Colors\n\n- Green (Blue + Yellow)\n- Orange (Red + Yellow)\n- Purple (Red + Blue)\n\n## Color Harmony\n\n- Complementary: Colors opposite on the color wheel\n- Analogous: Colors next to each other on the color wheel\n- Triadic: Three colors equally spaced on the color wheel\n\n## Psychology of Colors\n\n- Red: Energy, passion, danger\n- Blue: Trust, calm, stability\n- Green: Growth, health, prosperity\n- Yellow: Happiness, optimism, creativity",
    notebook_id: "2",
    user_id: "current-user",
    tags: ["design", "color-theory", "ui"],
    is_public: false,
    is_favorite: false,
    word_count: 130,
    reading_time: 2,
    ai_enabled: false,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    notebook: mockNotebooks[1],
  },
];

export class NotesApi {
  /**
   * Fetch user's notebooks
   */
  static async getNotebooks(): Promise<Notebook[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("notebooks")
        .select(
          `
          *,
          notes_count:notes(count)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        data.forEach((notebook: Record<string, unknown>) => {
          if (
            notebook.notes_count &&
            typeof notebook.notes_count === "object" &&
            "count" in notebook.notes_count
          ) {
            notebook.notes_count = notebook.notes_count.count;
          }
        });
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      // Return mock data for demo
      return mockNotebooks;
    }
  }

  /**
   * Create a new notebook
   */
  static async createNotebook(
    name: string,
    description?: string,
    color?: string
  ): Promise<Notebook> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("notebooks")
        .insert({
          name,
          description,
          color: color || "#7C3AED",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating notebook:", error);

      // Create a mock notebook for demo
      const newNotebook: Notebook = {
        id: Date.now().toString(),
        name,
        description,
        color: color || "#7C3AED",
        is_default: false,
        user_id: "current-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes_count: 0,
      };

      mockNotebooks.push(newNotebook);
      return newNotebook;
    }
  }

  /**
   * Update notebook
   */
  static async updateNotebook(
    id: string,
    updates: Partial<Notebook>
  ): Promise<Notebook> {
    try {
      const { data, error } = await supabase
        .from("notebooks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating notebook:", error);

      // Update mock notebook for demo
      const notebookIndex = mockNotebooks.findIndex((nb) => nb.id === id);
      if (notebookIndex >= 0) {
        mockNotebooks[notebookIndex] = {
          ...mockNotebooks[notebookIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return mockNotebooks[notebookIndex];
      }

      throw error;
    }
  }

  /**
   * Delete notebook
   */
  static async deleteNotebook(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("notebooks").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notebook:", error);

      // Delete from mock data for demo
      const notebookIndex = mockNotebooks.findIndex((nb) => nb.id === id);
      if (notebookIndex >= 0) {
        mockNotebooks.splice(notebookIndex, 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Fetch notes with filters
   */
  static async getNotes(filters?: NotesFilter): Promise<Note[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("notes")
        .select(
          `
          *,
          notebook:notebooks(id, name, color),
          author:profiles(id, full_name, avatar_url)
        `
        )
        .eq("user_id", user.id);

      if (filters?.notebook_id) {
        query = query.eq("notebook_id", filters.notebook_id);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps("tags", filters.tags);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
        );
      }

      if (filters?.is_favorite !== undefined) {
        query = query.eq("is_favorite", filters.is_favorite);
      }

      if (filters?.date_range) {
        query = query
          .gte("created_at", filters.date_range.start)
          .lte("created_at", filters.date_range.end);
      }

      const { data, error } = await query.order("updated_at", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching notes:", error);
      // Return mock data for demo

      // Apply filters to mock data
      let filteredNotes = [...mockNotes];

      if (filters?.notebook_id) {
        filteredNotes = filteredNotes.filter(
          (note) => note.notebook_id === filters.notebook_id
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        filteredNotes = filteredNotes.filter((note) =>
          filters.tags!.some((tag) => note.tags.includes(tag))
        );
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredNotes = filteredNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );
      }

      if (filters?.is_favorite !== undefined) {
        filteredNotes = filteredNotes.filter(
          (note) => note.is_favorite === filters.is_favorite
        );
      }

      return filteredNotes;
    }
  }

  /**
   * Get a single note by ID
   */
  static async getNote(id: string): Promise<Note> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          notebook:notebooks(id, name, color),
          author:profiles(id, full_name, avatar_url)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching note:", error);

      // Return mock note for demo
      const mockNote = mockNotes.find((note) => note.id === id);
      if (!mockNote) {
        throw new Error("Note not found");
      }
      return mockNote;
    }
  }

  /**
   * Create a new note
   */
  static async createNote(noteData: CreateNoteData): Promise<Note> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Calculate word count and reading time
      const content = noteData.content || "";
      const wordCount = content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

      const { data, error } = await supabase
        .from("notes")
        .insert({
          ...noteData,
          user_id: user.id,
          word_count: wordCount,
          reading_time: readingTime,
          content: content,
        })
        .select(
          `
          *,
          notebook:notebooks(id, name, color),
          author:profiles(id, full_name, avatar_url)
        `
        )
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating note:", error);

      // Create a mock note for demo
      const content = noteData.content || "";
      const wordCount = content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);

      const notebook = noteData.notebook_id
        ? mockNotebooks.find((nb) => nb.id === noteData.notebook_id)
        : mockNotebooks.find((nb) => nb.is_default);

      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        content: content,
        notebook_id:
          noteData.notebook_id || notebook?.id || mockNotebooks[0].id,
        user_id: "current-user",
        tags: noteData.tags || [],
        is_public: false,
        is_favorite: false,
        word_count: wordCount,
        reading_time: readingTime,
        ai_enabled: noteData.ai_enabled || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notebook: notebook || mockNotebooks[0],
      };

      mockNotes.push(newNote);

      // Update notebook notes count
      const notebookIndex = mockNotebooks.findIndex(
        (nb) => nb.id === newNote.notebook_id
      );
      if (notebookIndex >= 0) {
        mockNotebooks[notebookIndex].notes_count =
          (mockNotebooks[notebookIndex].notes_count || 0) + 1;
      }

      return newNote;
    }
  }

  /**
   * Update a note
   */
  static async updateNote(id: string, updates: UpdateNoteData): Promise<Note> {
    // Calculate word count and reading time if content is updated
    if (updates.content !== undefined) {
      const wordCount = updates.content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);
      updates = {
        ...updates,
        word_count: wordCount,
        reading_time: readingTime,
      } as Partial<
        UpdateNoteData & { word_count: number; reading_time: number }
      >;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          notebook:notebooks(id, name, color)
        `
        )
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note:", error);

      // Update mock note for demo
      const noteIndex = mockNotes.findIndex((note) => note.id === id);
      if (noteIndex >= 0) {
        // Handle notebook change
        let notebook = mockNotes[noteIndex].notebook;
        if (
          updates.notebook_id &&
          updates.notebook_id !== mockNotes[noteIndex].notebook_id
        ) {
          notebook =
            mockNotebooks.find((nb) => nb.id === updates.notebook_id) ||
            notebook;

          // Update old notebook notes count
          const oldNotebookIndex = mockNotebooks.findIndex(
            (nb) => nb.id === mockNotes[noteIndex].notebook_id
          );
          if (oldNotebookIndex >= 0) {
            mockNotebooks[oldNotebookIndex].notes_count = Math.max(
              0,
              (mockNotebooks[oldNotebookIndex].notes_count || 1) - 1
            );
          }

          // Update new notebook notes count
          const newNotebookIndex = mockNotebooks.findIndex(
            (nb) => nb.id === updates.notebook_id
          );
          if (newNotebookIndex >= 0) {
            mockNotebooks[newNotebookIndex].notes_count =
              (mockNotebooks[newNotebookIndex].notes_count || 0) + 1;
          }
        }

        mockNotes[noteIndex] = {
          ...mockNotes[noteIndex],
          ...updates,
          updated_at: new Date().toISOString(),
          notebook,
        };

        return mockNotes[noteIndex];
      }

      throw new Error("Note not found");
    }
  }

  /**
   * Delete a note
   */
  static async deleteNote(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting note:", error);

      // Delete from mock data for demo
      const noteIndex = mockNotes.findIndex((note) => note.id === id);
      if (noteIndex >= 0) {
        const notebookId = mockNotes[noteIndex].notebook_id;
        mockNotes.splice(noteIndex, 1);

        // Update notebook notes count
        const notebookIndex = mockNotebooks.findIndex(
          (nb) => nb.id === notebookId
        );
        if (notebookIndex >= 0) {
          mockNotebooks[notebookIndex].notes_count = Math.max(
            0,
            (mockNotebooks[notebookIndex].notes_count || 1) - 1
          );
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Get AI insights for a note
   */
  static async getAIInsights(noteId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("note_id", noteId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting AI insights:", error);

      // Return mock insights for demo
      return [
        {
          id: "1",
          note_id: noteId,
          type: "summary",
          content: "This note covers key concepts about...",
          created_at: new Date().toISOString(),
        },
      ];
    }
  }

  /**
   * Generate AI insights for a note
   */
  static async generateAIInsights(
    noteId: string,
    type: AIInsight["type"]
  ): Promise<AIInsight> {
    try {
      // Call Supabase Edge Function
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-ai-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            note_id: noteId,
            question: `Generate a ${type} for this note`,
            action: type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate AI insights");
      }

      const result = await response.json();

      // Save the insight to the database
      const { data, error } = await supabase
        .from("ai_insights")
        .insert({
          note_id: noteId,
          type,
          content: result.response,
          metadata: {
            suggestions: result.suggestions,
            related_topics: result.related_topics,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error generating AI insights:", error);

      // Return mock insight for demo
      const mockInsight: AIInsight = {
        id: Date.now().toString(),
        note_id: noteId,
        type,
        content:
          type === "summary"
            ? "This note covers important concepts related to the topic, including key definitions, examples, and practical applications."
            : type === "quiz"
              ? "Q1: What is the main concept discussed in this note?\nQ2: How would you apply this knowledge in a real-world scenario?\nQ3: Explain the relationship between the concepts mentioned."
              : "This concept connects to several related topics and builds upon fundamental principles in this field.",
        created_at: new Date().toISOString(),
      };

      return mockInsight;
    }
  }

  /**
   * Extract YouTube transcript
   */
  static async extractYouTubeTranscript(
    videoUrl: string
  ): Promise<YouTubeTranscript> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-transcript`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ video_url: videoUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract YouTube transcript");
      }

      return response.json();
    } catch (error) {
      console.error("Error extracting YouTube transcript:", error);

      // Return mock transcript for demo
      const videoId = videoUrl.includes("youtube.com/watch?v=")
        ? videoUrl.split("v=")[1].split("&")[0]
        : videoUrl.includes("youtu.be/")
          ? videoUrl.split("youtu.be/")[1].split("?")[0]
          : "unknown";

      return {
        id: Date.now().toString(),
        video_id: videoId,
        title: "YouTube Video Transcript",
        transcript: [
          {
            start: 0,
            duration: 5,
            text: "Hello and welcome to this video.",
          },
          {
            start: 5,
            duration: 10,
            text: "Today we'll be discussing an important topic.",
          },
          {
            start: 15,
            duration: 15,
            text: "Let's dive into the details and explore this subject further.",
          },
        ],
        summary:
          "This video provides an introduction to the topic and discusses key concepts.",
        key_points: [
          "Introduction to the topic",
          "Key concepts explained",
          "Practical applications",
        ],
        created_at: new Date().toISOString(),
      };
    }
  }

  /**
   * Search notes with advanced filters
   */
  static async searchNotes(query: string): Promise<Note[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Use full-text search
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          notebook:notebooks(id, name, color),
          author:profiles(id, full_name, avatar_url)
        `
        )
        .eq("user_id", user.id)
        .textSearch("title,content", query)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching notes:", error);

      // Search mock notes for demo
      const searchQuery = query.toLowerCase();
      return mockNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery) ||
          note.content.toLowerCase().includes(searchQuery)
      );
    }
  }

  /**
   * Get popular tags
   */
  static async getPopularTags(): Promise<string[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("notes")
        .select("tags")
        .eq("user_id", user.id);

      if (error) throw error;

      // Flatten and count tags
      const tagCounts = new Map<string, number>();
      data?.forEach((note) => {
        note.tags?.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      // Return top 20 tags sorted by frequency
      return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([tag]) => tag);
    } catch (error) {
      console.error("Error fetching popular tags:", error);

      // Get tags from mock notes for demo
      const tagCounts = new Map<string, number>();
      mockNotes.forEach((note) => {
        note.tags?.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([tag]) => tag);
    }
  }

  /**
   * Export note to different formats
   */
  static async exportNote(
    noteId: string,
    format: "pdf" | "md" | "docx"
  ): Promise<Blob> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ note_id: noteId, format }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export note");
      }

      return response.blob();
    } catch (error) {
      console.error("Error exporting note:", error);

      // Create a mock blob for demo
      const foundNote = mockNotes.find((n) => n.id === noteId);
      if (!foundNote) {
        throw new Error("Note not found");
      }
      let content = "";
      if (format === "md") {
        content = `# ${foundNote.title}\n\n${foundNote.content}`;
      } else {
        content = `${foundNote.title}\n\n${foundNote.content}`;
      }
      return new Blob([content], {
        type: format === "md" ? "text/markdown" : "application/octet-stream",
      });
    }
  }

  /**
   * Subscribe to real-time updates
   */
  static subscribeToUpdates(
    userId: string,
    onNotesUpdate: (notes: Note[]) => void,
    onNotebooksUpdate: (notebooks: Notebook[]) => void
  ) {
    // Subscribe to notes changes
    const notesSubscription = supabase
      .channel("notes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const notes = await this.getNotes();
          onNotesUpdate(notes);
        }
      )
      .subscribe();

    // Subscribe to notebooks changes
    const notebooksSubscription = supabase
      .channel("notebooks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notebooks",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const notebooks = await this.getNotebooks();
          onNotebooksUpdate(notebooks);
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      notesSubscription.unsubscribe();
      notebooksSubscription.unsubscribe();
    };
  }
}

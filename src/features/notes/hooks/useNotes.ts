import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { NotesApi } from "../api/notesApi";
import { useAuth } from "@/features/auth/components/AuthProvider";
import type {
  NotesState,
  Notebook,
  CreateNoteData,
  UpdateNoteData,
  NotesFilter,
} from "../types/notesTypes";

const initialState: NotesState = {
  notebooks: [],
  notes: [],
  currentNote: null,
  selectedNotebook: null,
  searchQuery: "",
  selectedTags: [],
  sortBy: "updated",
  sortOrder: "desc",
  viewMode: "list",
  loading: false,
  error: null,
  aiInsights: [],
  templates: [],
};

export function useNotes() {
  const { user } = useAuth();
  const [state, setState] = useState<NotesState>(initialState);

  /**
   * Load notebooks and notes
   */
  const loadData = useCallback(async () => {
    if (!user) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [notebooks, notes] = await Promise.all([
        NotesApi.getNotebooks(),
        NotesApi.getNotes(),
      ]);

      setState((prev) => ({
        ...prev,
        notebooks,
        notes,
        loading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
      toast.error("Failed to load notes");
    }
  }, [user]);

  /**
   * Create a new notebook
   */
  const createNotebook = useCallback(
    async (name: string, description?: string, color?: string) => {
      try {
        const notebook = await NotesApi.createNotebook(
          name,
          description,
          color
        );
        setState((prev) => ({
          ...prev,
          notebooks: [notebook, ...prev.notebooks],
        }));
        toast.success("Notebook created successfully");
        return notebook;
      } catch (error) {
        console.error("Error creating notebook:", error);
        toast.error("Failed to create notebook");
        throw error;
      }
    },
    []
  );

  /**
   * Update a notebook
   */
  const updateNotebook = useCallback(
    async (id: string, updates: Partial<Notebook>) => {
      try {
        const updatedNotebook = await NotesApi.updateNotebook(id, updates);
        setState((prev) => ({
          ...prev,
          notebooks: prev.notebooks.map((nb) =>
            nb.id === id ? updatedNotebook : nb
          ),
        }));
        toast.success("Notebook updated successfully");
        return updatedNotebook;
      } catch (error) {
        console.error("Error updating notebook:", error);
        toast.error("Failed to update notebook");
        throw error;
      }
    },
    []
  );

  /**
   * Delete a notebook
   */
  const deleteNotebook = useCallback(async (id: string) => {
    try {
      await NotesApi.deleteNotebook(id);
      setState((prev) => ({
        ...prev,
        notebooks: prev.notebooks.filter((nb) => nb.id !== id),
        selectedNotebook:
          prev.selectedNotebook === id ? null : prev.selectedNotebook,
      }));
      toast.success("Notebook deleted successfully");
    } catch (error) {
      console.error("Error deleting notebook:", error);
      toast.error("Failed to delete notebook");
      throw error;
    }
  }, []);

  /**
   * Create a new note
   */
  const createNote = useCallback(async (noteData: CreateNoteData) => {
    try {
      const note = await NotesApi.createNote(noteData);
      setState((prev) => ({
        ...prev,
        notes: [note, ...prev.notes],
        currentNote: note,
      }));
      toast.success("Note created successfully");
      return note;
    } catch {
      toast.error("Failed to create note");
      throw new Error("Failed to create note");
    }
  }, []);

  /**
   * Update a note
   */
  const updateNote = useCallback(
    async (id: string, updates: UpdateNoteData) => {
      try {
        const updatedNote = await NotesApi.updateNote(id, updates);
        setState((prev) => ({
          ...prev,
          notes: prev.notes.map((note) =>
            note.id === id ? updatedNote : note
          ),
          currentNote:
            prev.currentNote?.id === id ? updatedNote : prev.currentNote,
        }));
        return updatedNote;
      } catch {
        toast.error("Failed to update note");
        throw new Error("Failed to update note");
      }
    },
    []
  );

  /**
   * Delete a note
   */
  const deleteNote = useCallback(async (id: string) => {
    try {
      await NotesApi.deleteNote(id);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== id),
        currentNote: prev.currentNote?.id === id ? null : prev.currentNote,
      }));
      toast.success("Note deleted successfully");
    } catch {
      toast.error("Failed to delete note");
      throw new Error("Failed to delete note");
    }
  }, []);

  /**
   * Set current note
   */
  const setCurrentNote = useCallback(async (noteId: string | null) => {
    if (!noteId) {
      setState((prev) => ({ ...prev, currentNote: null }));
      return;
    }

    try {
      const note = await NotesApi.getNote(noteId);
      setState((prev) => ({ ...prev, currentNote: note }));
    } catch {
      toast.error("Failed to load note");
    }
  }, []);

  /**
   * Filter notes
   */
  const filterNotes = useCallback(async (filters: NotesFilter) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const notes = await NotesApi.getNotes(filters);
      setState((prev) => ({
        ...prev,
        notes,
        loading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to filter notes",
      }));
      toast.error("Failed to filter notes");
    }
  }, []);

  /**
   * Search notes
   */
  const searchNotes = useCallback(async (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query, loading: true }));

    try {
      const notes = query
        ? await NotesApi.searchNotes(query)
        : await NotesApi.getNotes();

      setState((prev) => ({
        ...prev,
        notes,
        loading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to search notes",
      }));
      toast.error("Failed to search notes");
    }
  }, []);

  /**
   * Set selected notebook
   */
  const setSelectedNotebook = useCallback(
    (notebookId: string | null) => {
      setState((prev) => ({ ...prev, selectedNotebook: notebookId }));

      if (notebookId) {
        filterNotes({ notebook_id: notebookId });
      } else {
        loadData();
      }
    },
    [filterNotes, loadData]
  );

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(
    async (noteId: string) => {
      const note = state.notes.find((n) => n.id === noteId);
      if (!note) return;

      try {
        await updateNote(noteId, { is_favorite: !note.is_favorite });
      } catch (error) {
        // Error already handled in updateNote
      }
    },
    [state.notes, updateNote]
  );

  /**
   * Export note
   */
  const exportNote = useCallback(
    async (noteId: string, format: "pdf" | "md" | "docx") => {
      try {
        const blob = await NotesApi.exportNote(noteId, format);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `note.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Note exported successfully");
      } catch (error) {
        console.error("Error exporting note:", error);
        toast.error("Failed to export note");
      }
    },
    []
  );

  /**
   * Set up real-time subscriptions
   */
  useEffect(() => {
    if (!user || !user.id) {
      console.log("User not authenticated, skipping realtime subscriptions");
      return;
    }

    const cleanup = NotesApi.subscribeToUpdates(
      user.id,
      (notes) => {
        console.log("Realtime notes update:", notes);
        setState((prev) => ({ ...prev, notes }));
      },
      (notebooks) => {
        setState((prev) => ({ ...prev, notebooks }));
      }
    );

    return cleanup;
  }, [user]);

  /**
   * Load data on mount and user change
   */
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setState(initialState);
    }
  }, [user, loadData]);

  return {
    ...state,
    // Actions
    createNotebook,
    updateNotebook,
    deleteNotebook,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    filterNotes,
    searchNotes,
    setSelectedNotebook,
    toggleFavorite,
    exportNote,
    loadData,
    // Setters
    setSearchQuery: (query: string) =>
      setState((prev) => ({ ...prev, searchQuery: query })),
    setSelectedTags: (tags: string[]) =>
      setState((prev) => ({ ...prev, selectedTags: tags })),
    setSortBy: (sortBy: NotesState["sortBy"]) =>
      setState((prev) => ({ ...prev, sortBy })),
    setSortOrder: (sortOrder: NotesState["sortOrder"]) =>
      setState((prev) => ({ ...prev, sortOrder })),
    setViewMode: (viewMode: NotesState["viewMode"]) =>
      setState((prev) => ({ ...prev, viewMode })),
  };
}

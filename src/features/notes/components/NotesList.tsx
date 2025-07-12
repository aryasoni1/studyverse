import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useNotes } from "../hooks/useNotes";
import { cn } from "@/lib/utils";
import type { Note } from "../types/notesTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NotesListProps {
  notes: Note[];
  currentNote: Note | null;
  onSelectNote: (noteId: string) => void;
  viewMode: "list" | "grid";
  loading: boolean;
}

export function NotesList({
  notes,
  currentNote,
  onSelectNote,
  viewMode,
  loading,
}: NotesListProps) {
  const { deleteNote, toggleFavorite, exportNote } = useNotes();

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
      } catch {
        // Error already handled in hook
      }
    }
  };

  const handleToggleFavorite = async (
    noteId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      await toggleFavorite(noteId);
    } catch {
      // Error already handled in hook
    }
  };

  const handleExport = async (
    noteId: string,
    format: "pdf" | "md" | "docx"
  ) => {
    try {
      await exportNote(noteId, format);
    } catch {
      // Error already handled in hook
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium">No notes found</h3>
            <p className="text-sm text-muted-foreground">
              Create your first note to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div
        className={cn(
          "p-2",
          viewMode === "grid" ? "grid grid-cols-1 gap-2" : "space-y-1"
        )}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            className={cn(
              "group relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
              currentNote?.id === note.id
                ? "bg-primary/10 border-primary/20"
                : "bg-background hover:bg-muted/50",
              viewMode === "grid" && "min-h-[120px]"
            )}
            onClick={() => onSelectNote(note.id)}
          >
            {/* Note Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                  {note.title || "Untitled"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(note.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                  {note.notebook && (
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: note.notebook.color }}
                      />
                      <span className="text-xs text-muted-foreground truncate">
                        {note.notebook.name}
                      </span>
                    </div>
                  )}
                  {/* Author info */}
                  <div className="flex items-center gap-1 ml-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={note.author?.avatar_url || ""} />
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        {note.author?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {note.author?.full_name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleToggleFavorite(note.id, e)}
                >
                  <Star
                    className={cn(
                      "h-3 w-3",
                      note.is_favorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleExport(note.id, "pdf")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport(note.id, "md")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Note Content Preview */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {truncateContent(note.content)}
              </p>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Note Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>{note.word_count} words</span>
                  <span>{note.reading_time} min read</span>
                </div>

                {note.ai_enabled && (
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3 text-purple-500" />
                    <span className="text-purple-500">AI</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

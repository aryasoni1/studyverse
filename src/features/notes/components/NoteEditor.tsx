import { useState, useEffect, useRef, useCallback } from "react";
import {
  Star,
  Share,
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Brain,
  Maximize,
  Calendar,
  Tag,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Note } from "../types/notesTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, toggleFavorite } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags);
  const [newTag, setNewTag] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Debounce content changes for auto-save
  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);

  // Auto-save effect
  useEffect(() => {
    if (debouncedContent !== note.content || debouncedTitle !== note.title) {
      handleSave();
    }
  }, [debouncedContent, debouncedTitle]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateNote(note.id, {
        title: title.trim() || "Untitled",
        content,
        tags,
      });
      setLastSaved(new Date());
    } catch {
      // Error already handled in hook
    } finally {
      setIsSaving(false);
    }
  }, [note.id, title, content, tags, updateNote, isSaving]);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(note.id);
    } catch {
      // Error already handled in hook
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }

    // Bold shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      insertFormatting("**", "**");
    }

    // Italic shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      insertFormatting("*", "*");
    }
  };

  const insertFormatting = (before: string, after: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background",
        isFullscreen && "fixed inset-0 z-50"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(new Date(note.created_at))}</span>
          <span>•</span>
          <span>Updated {formatDate(new Date(note.updated_at))}</span>
          {lastSaved && (
            <>
              <span>•</span>
              <span className="text-green-600">
                {isSaving ? "Saving..." : `Saved ${formatDate(lastSaved)}`}
              </span>
            </>
          )}
          {/* Author info */}
          <span>•</span>
          <div className="flex items-center gap-1">
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

        <div className="flex items-center gap-2">
          {note.ai_enabled && (
            <Badge variant="secondary" className="text-xs">
              <Brain className="mr-1 h-3 w-3 text-purple-500" />
              AI Enabled
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={handleToggleFavorite}>
            <Star
              className={cn(
                "h-4 w-4",
                note.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Code className="mr-2 h-4 w-4" />
                View Source
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("**", "**")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("*", "*")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("<u>", "</u>")}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("\n- ", "")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("\n1. ", "")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("[", "](url)")}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("![alt](", ")")}
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting("```\n", "\n```")}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <div className="text-xs text-muted-foreground">
          {content.split(/\s+/).filter((word) => word.length > 0).length} words
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <div className="p-4 border-b">
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tags */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveTag(tag)}
              >
                #{tag} ×
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button size="sm" onClick={handleAddTag}>
              Add
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="min-h-full border-none p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed"
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Plus, Search, Grid, List, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NotebooksSidebar } from "./NotebooksSidebar";
import { NotesList } from "./NotesList";
import { NoteEditor } from "./NoteEditor";
import { CreateNoteModal } from "./CreateNoteModal";
import { useNotes } from "../hooks/useNotes";
import { cn } from "@/lib/utils";

export function NotesPage() {
  const {
    notes,
    notebooks,
    currentNote,
    selectedNotebook,
    searchQuery,
    selectedTags,
    viewMode,
    loading,
    setCurrentNote,
    setSelectedNotebook,
    searchNotes,
    setSearchQuery,
    setSelectedTags,
    setViewMode,
  } = useNotes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchNotes(query);
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
  };

  const selectedNotebookData = notebooks.find(
    (nb) => nb.id === selectedNotebook
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Notebooks Sidebar */}
      <NotebooksSidebar
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        onSelectNotebook={setSelectedNotebook}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Notes List */}
      <div
        className={cn(
          "flex flex-col border-r bg-muted/20 transition-all duration-300",
          sidebarCollapsed ? "w-96" : "w-80"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {selectedNotebookData ? selectedNotebookData.name : "All Notes"}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {notes.length}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
              >
                {viewMode === "list" ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sort by Date</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Title</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Size</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export All</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Active Filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleTagRemove(tag)}
                >
                  #{tag} ×
                </Badge>
              ))}
            </div>
          )}

          {/* New Note Button */}
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Notes List */}
        <NotesList
          notes={notes}
          currentNote={currentNote}
          onSelectNote={setCurrentNote}
          viewMode={viewMode === "compact" ? "list" : viewMode}
          loading={loading}
        />
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <NoteEditor note={currentNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No note selected</h3>
                <p className="text-muted-foreground">
                  Select a note from the sidebar or create a new one to get
                  started.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Note
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
      />
    </div>
  );
}

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateNotebookModal } from "./CreateNotebookModal";
import { useNotes } from "../hooks/useNotes";
import { cn } from "@/lib/utils";
import type { Notebook } from "../types/notesTypes";

interface NotebooksSidebarProps {
  notebooks: Notebook[];
  selectedNotebook: string | null;
  onSelectNotebook: (notebookId: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function NotebooksSidebar({
  notebooks,
  selectedNotebook,
  onSelectNotebook,
  collapsed,
  onToggleCollapse,
}: NotebooksSidebarProps) {
  const { deleteNotebook } = useNotes();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteNotebook = async (notebookId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this notebook? All notes in it will be moved to the default notebook."
      )
    ) {
      try {
        await deleteNotebook(notebookId);
      } catch (error) {
        // Error already handled in hook
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold">Notebooks</h2>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {!collapsed && (
            <div className="mt-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notebooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8"
                />
              </div>

              {/* New Notebook Button */}
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
                className="w-full h-8 text-xs"
              >
                <Plus className="mr-2 h-3 w-3" />
                New Notebook
              </Button>
            </div>
          )}
        </div>

        {/* Notebooks List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {/* All Notes */}
            <Button
              variant={selectedNotebook === null ? "secondary" : "ghost"}
              className={cn("w-full justify-start h-10", collapsed && "px-2")}
              onClick={() => onSelectNotebook(null)}
            >
              <Folder className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">All Notes</span>
                  <Badge variant="secondary" className="text-xs">
                    {notebooks.reduce(
                      (sum, nb) => sum + (nb.notes_count || 0),
                      0
                    )}
                  </Badge>
                </>
              )}
            </Button>

            {/* Individual Notebooks */}
            {filteredNotebooks.map((notebook) => (
              <div key={notebook.id} className="group relative">
                <Button
                  variant={
                    selectedNotebook === notebook.id ? "secondary" : "ghost"
                  }
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed && "px-2"
                  )}
                  onClick={() => onSelectNotebook(notebook.id)}
                >
                  <div
                    className={cn("h-4 w-4 rounded", collapsed ? "" : "mr-3")}
                    style={{ backgroundColor: notebook.color }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {notebook.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {notebook.notes_count || 0}
                      </Badge>
                    </>
                  )}
                </Button>

                {!collapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteNotebook(notebook.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}

            {filteredNotebooks.length === 0 && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No notebooks found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {collapsed && (
          <div className="p-2 border-t">
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="ghost"
              size="sm"
              className="w-full h-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CreateNotebookModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}

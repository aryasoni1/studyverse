import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, X, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useNotes } from '../hooks/useNotes';
import { cn } from '@/lib/utils';

const createNotebookSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string().default('#7C3AED'),
});

type CreateNotebookFormData = z.infer<typeof createNotebookSchema>;

interface CreateNotebookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  '#7C3AED', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
];

export function CreateNotebookModal({
  open,
  onOpenChange,
}: CreateNotebookModalProps) {
  const { createNotebook } = useNotes();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#7C3AED');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNotebookFormData>({
    resolver: zodResolver(createNotebookSchema),
    defaultValues: {
      color: '#7C3AED',
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setSelectedColor('#7C3AED');
  };

  const onSubmit = async (data: CreateNotebookFormData) => {
    setLoading(true);
    try {
      await createNotebook(data.name, data.description, selectedColor);
      handleClose();
    } catch (error) {
      // Error already handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              Create New Notebook
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Notebook Name *</Label>
            <Input
              id="name"
              placeholder="Enter notebook name..."
              {...register('name')}
              className="h-12"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this notebook is for..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label>Choose Color</Label>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'h-10 w-10 rounded-lg border-2 transition-all hover:scale-110',
                    selectedColor === color 
                      ? 'border-foreground shadow-lg' 
                      : 'border-transparent hover:border-muted-foreground'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-3">
              <div
                className="h-6 w-6 rounded"
                style={{ backgroundColor: selectedColor }}
              />
              <div>
                <h4 className="font-medium">Preview</h4>
                <p className="text-sm text-muted-foreground">
                  This is how your notebook will appear in the sidebar
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Notebook'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
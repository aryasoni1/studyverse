import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
});

// Note validations
export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  skill_id: z.string().uuid().optional(),
  is_public: z.boolean().default(false),
});

// Study session validations
export const studySessionSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200, 'Topic must be less than 200 characters'),
  estimated_duration: z.number().min(5).max(480).optional(), // 5 minutes to 8 hours
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

// AI Assistant validations
export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  context: z.object({
    skill: z.string().optional(),
    topic: z.string().optional(),
    user_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }).optional(),
});

// Search validations
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query must be less than 100 characters'),
  filters: z.object({
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    type: z.enum(['skills', 'courses', 'notes', 'users']).optional(),
  }).optional(),
  limit: z.number().min(1).max(50).default(20),
  page: z.number().min(1).default(1),
});

// Utility types
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type StudySessionInput = z.infer<typeof studySessionSchema>;
export type AIChatInput = z.infer<typeof aiChatSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
// Application constants

export const APP_CONFIG = {
  name: 'SkillForge',
  description: 'Modern skill development platform',
  version: '1.0.0',
  author: 'SkillForge Team',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  users: {
    base: '/users',
    profile: '/users/profile',
    preferences: '/users/preferences',
  },
  skills: {
    base: '/skills',
    categories: '/skills/categories',
    search: '/skills/search',
  },
  notes: {
    base: '/notes',
    search: '/notes/search',
    tags: '/notes/tags',
  },
  ai: {
    chat: '/ai/chat',
    suggestions: '/ai/suggestions',
    flashcards: '/ai/flashcards',
  },
} as const;

export const STORAGE_KEYS = {
  theme: 'skillforge-theme',
  preferences: 'skillforge-preferences',
  recentSearches: 'skillforge-recent-searches',
  draftNotes: 'skillforge-draft-notes',
} as const;

export const UI_CONFIG = {
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

export const SKILL_CATEGORIES = [
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Design',
  'Product Management',
  'Marketing',
  'Business',
] as const;

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;
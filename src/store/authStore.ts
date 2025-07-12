import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string | null;
  subscription_tier?: string;
  usage_count?: number;
  usage_limit?: number;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsage: (increment: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,

      initialize: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          set({ isLoading: false, isInitialized: true });
          return;
        }
        if (data.session && data.session.user) {
          set({
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
              full_name: data.session.user.user_metadata?.full_name,
              avatar_url: data.session.user.user_metadata?.avatar_url,
            },
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          isInitialized: true,
        });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.session) {
          set({ isLoading: false, isAuthenticated: false });
          throw error || new Error("Login failed");
        }
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
          },
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      signup: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error || !data.user) {
          set({ isLoading: false, isAuthenticated: false });
          throw error || new Error("Signup failed");
        }
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name,
            avatar_url: data.user.user_metadata?.avatar_url,
          },
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      updateUsage: async (increment) => {
        // Implement usage tracking with Supabase if needed
        // For now, just update local state
        const { user } = get();
        if (!user) return;
        set({
          user: {
            ...user,
            usage_count: (user.usage_count || 0) + increment,
            updated_at: new Date().toISOString(),
          },
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
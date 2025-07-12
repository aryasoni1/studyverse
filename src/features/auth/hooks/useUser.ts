import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AuthApi } from "../api/authApi";
import type { User, AuthState } from "../types/authTypes";

export function useUser(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await AuthApi.getCurrentUser();

        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load user session");
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            firstName: session.user.user_metadata?.firstName,
            lastName: session.user.user_metadata?.lastName,
            fullName: session.user.user_metadata?.fullName,
            avatarUrl: session.user.user_metadata?.avatarUrl,
            emailConfirmed: session.user.email_confirmed_at !== null,
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
          };
          setUser(userData);
        } else {
          setUser(null);
        }

        setError(null);
      } catch (err) {
        setError("Failed to update user session");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
  };
}

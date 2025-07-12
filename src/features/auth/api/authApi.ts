import { supabase } from '@/lib/supabase';
import type { 
  LoginFormData, 
  SignupFormData, 
  AuthResponse, 
  User,
  OAuthProvider 
} from '../types/authTypes';

export class AuthApi {
  /**
   * Sign in with email and password
   */
  static async signIn(data: LoginFormData): Promise<AuthResponse<User>> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.message,
          },
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: {
            message: 'Authentication failed',
          },
        };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: authData.user.user_metadata?.firstName,
        lastName: authData.user.user_metadata?.lastName,
        fullName: authData.user.user_metadata?.fullName,
        avatarUrl: authData.user.user_metadata?.avatarUrl,
        emailConfirmed: authData.user.email_confirmed_at !== null,
        createdAt: authData.user.created_at,
        updatedAt: authData.user.updated_at || authData.user.created_at,
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(data: SignupFormData): Promise<AuthResponse<User>> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.message,
          },
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: {
            message: 'Registration failed',
          },
        };
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        emailConfirmed: authData.user.email_confirmed_at !== null,
        createdAt: authData.user.created_at,
        updatedAt: authData.user.updated_at || authData.user.created_at,
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Sign in with OAuth provider
   */
  static async signInWithOAuth(provider: OAuthProvider['id']): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
        },
      };
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata?.firstName,
        lastName: user.user_metadata?.lastName,
        fullName: user.user_metadata?.fullName,
        avatarUrl: user.user_metadata?.avatarUrl,
        emailConfirmed: user.email_confirmed_at !== null,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}
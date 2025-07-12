import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthApi } from '../api/authApi';
import type { 
  LoginFormData, 
  SignupFormData, 
  OAuthProvider,
  AuthError 
} from '../types/authTypes';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  const signIn = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.signIn(data);

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      toast.success('Welcome back! Redirecting to your dashboard...');
      
      // Redirect after successful login
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1000);

      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.signUp(data);

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Redirect to login or dashboard based on email confirmation requirement
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2000);

      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.signOut();

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      toast.success('Signed out successfully');
      navigate('/');
      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.resetPassword(email);

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      toast.success('Password reset email sent! Please check your inbox.');
      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.updatePassword(password);

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      toast.success('Password updated successfully!');
      navigate('/app/dashboard');
      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: OAuthProvider['id']) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthApi.signInWithOAuth(provider);

      if (!response.success) {
        setError(response.error!);
        toast.error(response.error!.message);
        return false;
      }

      // OAuth redirect will handle navigation
      return true;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithOAuth,
  };
}
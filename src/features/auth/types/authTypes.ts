export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  emailConfirmed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface OAuthProvider {
  id: "google" | "github" | "apple" | "facebook";
  name: string;
  icon: string;
  color: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthResponse<T = unknown> {
  data?: T;
  error?: AuthError;
  success: boolean;
}

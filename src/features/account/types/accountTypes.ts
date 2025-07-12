export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isPublic: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  description: string;
  date: string;
  invoiceUrl?: string;
}

export interface Invitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  acceptedAt?: string;
}

export interface Feedback {
  id: string;
  type: "bug" | "feature" | "general";
  title: string;
  description: string;
  rating?: number;
  status: "submitted" | "in_progress" | "resolved" | "closed";
  submittedAt: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  createdAt?: string;
  updatedAt?: string;
}

export interface Plan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
}

export interface AccountSettings {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    isPublic: boolean;
    showActivity: boolean;
    allowInvites: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
  };
}

export interface AccountData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subscription: {
    tier: "free" | "pro" | "enterprise";
    status: "active" | "canceled" | "past_due";
    currentPeriodEnd: string;
  };
  usage: {
    current: number;
    limit: number;
  };
  settings: AccountSettings;
  billing: BillingInfo;
}

export interface AccountSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  isPublic: boolean;
  showActivity: boolean;
  allowInvites: boolean;
}

export interface BillingInfo {
  plans: BillingPlan[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  currentPlan: BillingPlan;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  date: string;
  description: string;
}

export interface AccountStats {
  totalInvites: number;
  acceptedInvites: number;
  pendingInvites: number;
  successRate: number;
  totalFeedback: number;
  resolvedFeedback: number;
}

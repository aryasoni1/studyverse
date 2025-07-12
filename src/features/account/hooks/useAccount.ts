import { useState, useEffect } from "react";
import {
  User,
  Subscription,
  PaymentHistory,
  Invitation,
  Feedback,
  AccountSettings,
} from "../types/accountTypes";
import { toast } from "sonner";

export function useAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const loadAccountData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUser({
          id: "1",
          name: "Alex Johnson",
          email: "alex.johnson@example.com",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          bio: "Passionate learner and technology enthusiast. Always exploring new ways to grow and improve.",
          isPublic: true,
          emailNotifications: true,
          pushNotifications: false,
          marketingEmails: true,
          createdAt: "2024-01-15",
        });

        setSubscription({
          id: "sub_1",
          plan: "pro",
          status: "active",
          currentPeriodStart: "2024-12-01",
          currentPeriodEnd: "2025-01-01",
          cancelAtPeriodEnd: false,
        });

        setPaymentHistory([
          {
            id: "pay_1",
            amount: 29.99,
            currency: "USD",
            status: "paid",
            description: "Pro Plan - Monthly",
            date: "2024-12-01",
            invoiceUrl: "#",
          },
          {
            id: "pay_2",
            amount: 29.99,
            currency: "USD",
            status: "paid",
            description: "Pro Plan - Monthly",
            date: "2024-11-01",
            invoiceUrl: "#",
          },
        ]);

        setInvitations([
          {
            id: "inv_1",
            email: "friend@example.com",
            status: "accepted",
            sentAt: "2024-11-20",
            acceptedAt: "2024-11-21",
          },
          {
            id: "inv_2",
            email: "colleague@example.com",
            status: "pending",
            sentAt: "2024-12-01",
          },
        ]);

        setFeedback([
          {
            id: "fb_1",
            type: "feature",
            title: "Dark mode for mobile app",
            description:
              "Would love to see a dark mode option in the mobile application.",
            rating: 4,
            status: "in_progress",
            submittedAt: "2024-11-15",
            tags: ["mobile", "ui"],
          },
        ]);

        setSettings({
          email: true,
          push: false,
          marketing: true,
          isPublic: true,
          showActivity: true,
          allowInvites: true,
          notifications: {
            email: true,
            push: false,
            marketing: true,
          },
          privacy: {
            isPublic: true,
            showActivity: true,
            allowInvites: true,
          },
          preferences: {
            theme: "system",
            language: "en",
            timezone: "UTC",
          },
        });
      } catch {
        toast.error("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  const updateUser = async (updatedUser: Partial<User>) => {
    try {
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const updateSettings = async (updatedSettings: Partial<AccountSettings>) => {
    try {
      setSettings((prev) => (prev ? { ...prev, ...updatedSettings } : null));
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const inviteFriend = async (email: string) => {
    try {
      const newInvitation: Invitation = {
        id: `inv_${Date.now()}`,
        email,
        status: "pending",
        sentAt: new Date().toISOString(),
      };
      setInvitations((prev) => [newInvitation, ...prev]);
      toast.success(`Invitation sent to ${email}`);
    } catch {
      toast.error("Failed to send invitation");
    }
  };

  const submitFeedback = async (
    feedbackData: Omit<Feedback, "id" | "submittedAt" | "status">
  ) => {
    try {
      const newFeedback: Feedback = {
        ...feedbackData,
        id: `fb_${Date.now()}`,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      };
      setFeedback((prev) => [newFeedback, ...prev]);
      toast.success("Feedback submitted successfully");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  const deleteAccount = async () => {
    try {
      // In a real app, this would call the API to delete the account
      toast.success(
        "Account deletion initiated. You will receive a confirmation email."
      );
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const exportData = async () => {
    try {
      // In a real app, this would generate and download user data
      const dataBlob = new Blob(
        [JSON.stringify({ user, subscription, feedback }, null, 2)],
        {
          type: "application/json",
        }
      );
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "account-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data");
    }
  };

  return {
    user,
    subscription,
    paymentHistory,
    invitations,
    feedback,
    settings,
    loading,
    updateUser,
    updateSettings,
    inviteFriend,
    submitFeedback,
    deleteAccount,
    exportData,
  };
}

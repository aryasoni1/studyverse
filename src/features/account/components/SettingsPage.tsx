import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  Trash2,
  Save,
  Camera,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Monitor,
  Edit3,
  Palette,
  Languages,
  Clock,
  TrendingUp,
  UserPlus,
  Smartphone,
  Lock,
} from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function SettingsPage() {
  const {
    user,
    settings,
    updateUser,
    updateSettings,
    deleteAccount,
    exportData,
  } = useAccount();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateUser(data);
    setIsEditing(false);
  };

  const handleNotificationChange = (
    type: "email" | "push" | "marketing",
    value: boolean
  ) => {
    updateSettings({
      notifications: {
        email: settings?.notifications?.email ?? false,
        push: settings?.notifications?.push ?? false,
        marketing: settings?.notifications?.marketing ?? false,
        [type]: value,
      },
    });
  };

  const handlePrivacyChange = (
    type: "isPublic" | "showActivity" | "allowInvites",
    value: boolean
  ) => {
    updateSettings({
      privacy: {
        isPublic: settings?.privacy?.isPublic ?? false,
        showActivity: settings?.privacy?.showActivity ?? false,
        allowInvites: settings?.privacy?.allowInvites ?? false,
        [type]: value,
      },
    });
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    updateSettings({
      preferences: {
        theme,
        language: settings?.preferences?.language ?? "en",
        timezone: settings?.preferences?.timezone ?? "UTC",
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Profile</span>
          </CardTitle>
          <CardDescription>
            Manage your personal information and public profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-muted text-xl font-medium">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Upload a new avatar. JPG, PNG or GIF. Max size 2MB.
              </p>
              <div className="flex space-x-2">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  disabled={!isEditing}
                  className="focus-ring"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={!isEditing}
                  className="focus-ring"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                {...form.register("bio")}
                disabled={!isEditing}
                className="min-h-[100px] focus-ring resize-none"
              />
              {form.formState.errors.bio && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button type="submit" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "email",
              title: "Email Notifications",
              description:
                "Receive updates about your courses and account via email",
              icon: Bell,
            },
            {
              key: "push",
              title: "Push Notifications",
              description:
                "Get notified about important updates on your device",
              icon: Smartphone,
            },
            {
              key: "marketing",
              title: "Marketing Communications",
              description:
                "Receive updates about new features and special offers",
              icon: Globe,
            },
          ].map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">
                      {notification.title}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={
                    settings?.notifications[
                      notification.key as keyof typeof settings.notifications
                    ] || false
                  }
                  onCheckedChange={(value) =>
                    handleNotificationChange(
                      notification.key as "email" | "push" | "marketing",
                      value
                    )
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Privacy</span>
          </CardTitle>
          <CardDescription>
            Control your privacy settings and account visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "isPublic",
              title: "Public Profile",
              description: "Make your profile visible to other users",
              icon: Globe,
            },
            {
              key: "showActivity",
              title: "Show Activity",
              description: "Display your learning progress on your profile",
              icon: TrendingUp,
            },
            {
              key: "allowInvites",
              title: "Allow Invitations",
              description: "Let other users invite you to courses and groups",
              icon: UserPlus,
            },
          ].map((privacy) => {
            const Icon = privacy.icon;
            return (
              <div
                key={privacy.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">
                      {privacy.title}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {privacy.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={
                    settings?.privacy[
                      privacy.key as keyof typeof settings.privacy
                    ] || false
                  }
                  onCheckedChange={(value) =>
                    handlePrivacyChange(
                      privacy.key as
                        | "isPublic"
                        | "showActivity"
                        | "allowInvites",
                      value
                    )
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Preferences</span>
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Monitor },
              ].map((theme) => {
                const Icon = theme.icon;
                const isActive = settings?.preferences.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() =>
                      handleThemeChange(theme.id as "light" | "dark" | "system")
                    }
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 mx-auto mb-2" />
                    <div className="text-sm font-medium">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <span>Language</span>
              </Label>
              <Select defaultValue="en">
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                  <SelectItem value="de">🇩🇪 German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Timezone</span>
              </Label>
              <Select defaultValue="UTC">
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">🌍 UTC</SelectItem>
                  <SelectItem value="EST">🇺🇸 Eastern Time</SelectItem>
                  <SelectItem value="PST">🇺🇸 Pacific Time</SelectItem>
                  <SelectItem value="CET">🇪🇺 Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-muted-foreground">
                Download all your account data
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

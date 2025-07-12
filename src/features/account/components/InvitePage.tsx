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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Copy,
  Mail,
  Link2,
  Users,
  Gift,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Share2,
  Trophy,
  Target,
} from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export function InvitePage() {
  const { invitations, inviteFriend } = useAccount();
  const [referralLink] = useState(
    "https://learningplatform.com/invite/alex123"
  );

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteFormData) => {
    await inviteFriend(data.email);
    form.reset();
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const acceptedInvites = invitations.filter(
    (inv) => inv.status === "accepted"
  ).length;
  const pendingInvites = invitations.filter(
    (inv) => inv.status === "pending"
  ).length;
  const totalInvites = invitations.length;

  const stats = [
    { title: "Total Invites", value: totalInvites, icon: Send },
    { title: "Accepted", value: acceptedInvites, icon: CheckCircle },
    { title: "Pending", value: pendingInvites, icon: Clock },
    {
      title: "Success Rate",
      value:
        totalInvites > 0
          ? Math.round((acceptedInvites / totalInvites) * 100)
          : 0,
      suffix: "%",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold">
                      {stat.value}
                      {stat.suffix || ""}
                    </p>
                  </div>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Send Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Invitation</span>
          </CardTitle>
          <CardDescription>
            Invite friends and colleagues to join your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter friend's email address..."
                  {...form.register("email")}
                  className="focus-ring"
                />
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </form>

          <Separator />

          {/* Referral Link */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                Your Referral Link
              </Label>
              <p className="text-sm text-muted-foreground">
                Share this link with anyone to invite them directly
              </p>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <code className="flex-1 text-sm font-mono truncate">
                {referralLink}
              </code>
              <Button size="sm" onClick={copyReferralLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Referral Rewards
                </h3>
                <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-3 w-3" />
                    <span>Earn 1 month Pro for every successful referral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3" />
                    <span>Friends get 30% off their first subscription</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Invitation History</span>
          </CardTitle>
          <CardDescription>
            Track the status of all your sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No invitations sent yet
              </h3>
              <p className="text-muted-foreground">
                Start building your learning network by inviting friends
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Accepted Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(invitation.status)} flex items-center space-x-1 w-fit`}
                        >
                          {getStatusIcon(invitation.status)}
                          <span>
                            {invitation.status.charAt(0).toUpperCase() +
                              invitation.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(invitation.sentAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {invitation.acceptedAt ? (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(
                                invitation.acceptedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

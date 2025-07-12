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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Star,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"], {
    required_error: "Please select a feedback type",
  }),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  rating: z.number().min(1).max(5).optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackPage() {
  const { feedback, submitFeedback } = useAccount();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    await submitFeedback({
      ...data,
      rating: rating > 0 ? rating : undefined,
    });
    form.reset();
    setRating(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "in_progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-600" />;
      case "feature":
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case "general":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      case "feature":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      case "general":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const feedbackTypes = [
    {
      id: "bug",
      title: "Report Bug",
      description: "Something isn't working correctly",
      icon: Bug,
    },
    {
      id: "feature",
      title: "Request Feature",
      description: "Suggest a new feature or improvement",
      icon: Lightbulb,
    },
    {
      id: "general",
      title: "General Feedback",
      description: "Share your thoughts or suggestions",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit" className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Submit Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>My Feedback</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          {/* Submit Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Submit Feedback</span>
              </CardTitle>
              <CardDescription>
                Help us improve by sharing your thoughts, reporting bugs, or
                suggesting features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <Select
                    onValueChange={(value: "bug" | "feature" | "general") =>
                      form.setValue("type", value)
                    }
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{type.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {type.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your feedback..."
                    {...form.register("title")}
                    className="focus-ring"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your feedback..."
                    {...form.register("description")}
                    className="min-h-[120px] focus-ring resize-none"
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Rating Section */}
                <div className="space-y-3">
                  <Label>Overall Experience (Optional)</Label>
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`transition-colors ${
                            star <= (hoveredRating || rating)
                              ? "text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {rating} out of 5 stars
                      </span>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Feedback Options */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Feedback</CardTitle>
              <CardDescription>
                Common feedback categories for faster submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        form.setValue(
                          "type",
                          type.id as "bug" | "feature" | "general"
                        );
                        form.setValue("title", `${type.title.toLowerCase()}`);
                      }}
                      className="p-4 border rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-5 w-5" />
                        <h3 className="font-medium">{type.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Feedback History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>My Feedback History</span>
              </CardTitle>
              <CardDescription>
                Track the status and responses to your submitted feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedback.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No feedback submitted yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Share your thoughts to help us improve!
                  </p>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Your First Feedback
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Submitted on{" "}
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={getTypeColor(item.type)}
                          >
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(item.status)} flex items-center space-x-1`}
                          >
                            {getStatusIcon(item.status)}
                            <span>
                              {item.status
                                .replace("_", " ")
                                .charAt(0)
                                .toUpperCase() +
                                item.status.replace("_", " ").slice(1)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {item.rating && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              Rating:
                            </span>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= item.rating!
                                      ? "text-yellow-400 fill-current"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({item.rating}/5)
                              </span>
                            </div>
                          </div>
                        )}

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

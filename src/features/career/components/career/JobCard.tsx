import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Job } from "../../types/careerTypes";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onView: (job: Job) => void;
  isApplied: boolean;
  isApplying?: boolean;
  viewMode?: "grid" | "list";
}

export function JobCard({
  job,
  onApply,
  onView,
  isApplied,
  isApplying,
  viewMode = "grid",
}: JobCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "part-time":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "contract":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
      case "internship":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="border-0 shadow-sm bg-card/50 hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3
                    className="text-lg font-medium mb-1 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => onView(job)}
                  >
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                </div>
                {isApplied && (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">Applied</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.job_type.replace("-", " ")}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(job.posted_date)}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 6).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 6}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <Badge
                className={`${getTypeColor(job.job_type)} text-xs font-normal border`}
              >
                {job.job_type.charAt(0).toUpperCase() +
                  job.job_type.slice(1).replace("-", " ")}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(job)}
                  className="rounded-full"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApply(job.id)}
                  disabled={isApplied || isApplying}
                  className="rounded-full"
                >
                  {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group border-0 shadow-sm bg-card/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle
              className="text-lg group-hover:text-primary transition-colors cursor-pointer"
              onClick={() => onView(job)}
            >
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          {isApplied && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-medium">Applied</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.job_type.replace("-", " ")}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        <Badge
          className={`${getTypeColor(job.job_type)} text-xs font-normal border`}
        >
          {job.job_type.charAt(0).toUpperCase() +
            job.job_type.slice(1).replace("-", " ")}
        </Badge>

        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        <div className="space-y-2">
          <div className="text-sm font-medium">Skills:</div>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Posted {formatDate(job.posted_date)}</span>
          </div>
          {job.application_deadline && (
            <span>Deadline: {formatDate(job.application_deadline)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => onView(job)}
          className="flex-1 rounded-full"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button
          onClick={() => onApply(job.id)}
          disabled={isApplied || isApplying}
          className="flex-1 rounded-full"
        >
          {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

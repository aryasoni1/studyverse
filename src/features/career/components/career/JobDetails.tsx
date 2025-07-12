import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle,
  Users,
  Target,
} from "lucide-react";
import { Job } from "../../types/careerTypes";

interface JobDetailsProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobId: string) => void;
  isApplied: boolean;
  isApplying?: boolean;
}

export function JobDetails({
  job,
  open,
  onOpenChange,
  onApply,
  isApplied,
  isApplying,
}: JobDetailsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-orange-100 text-orange-800";
      case "internship":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-5 h-5" />
                  <span className="text-lg font-medium">{job.company}</span>
                </div>
              </div>
              {isApplied && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Applied</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{job.job_type.replace("-", " ")}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Posted {formatDate(job.posted_date)}</span>
              </div>
            </div>

            <Badge className={getTypeColor(job.job_type)}>
              {job.job_type.charAt(0).toUpperCase() +
                job.job_type.slice(1).replace("-", " ")}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Job Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {job.application_deadline && (
            <>
              <Separator />
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Application Deadline</span>
                </div>
                <p className="text-orange-700 mt-1">
                  Applications must be submitted by{" "}
                  {formatDate(job.application_deadline)}
                </p>
              </div>
            </>
          )}

          {/* Apply Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => onApply(job.id)}
              disabled={isApplied || isApplying}
              className="flex-1"
            >
              {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

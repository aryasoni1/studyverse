import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  Grid3X3,
  List,
} from "lucide-react";
import { JobCard } from "./JobCard";
import { JobDetails } from "./JobDetails";
import { useJobs } from "../../hooks/useJobs";
import { Job } from "../../types/careerTypes";
import { toast } from "@/hooks/use-toast";

export function JobBoard() {
  const { jobs, loading, filters, updateFilters, applyToJob, isApplied } =
    useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handleApply = async (jobId: string) => {
    if (isApplied(jobId)) return;

    setApplying(jobId);
    try {
      await applyToJob(jobId);
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
    } catch (error) {
      toast({
        title: "Application failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplying(null);
    }
  };

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const locations = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-muted/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Job Board</h1>
            <p className="text-muted-foreground font-light">
              Discover opportunities that match your skills
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
            <Briefcase className="w-4 h-4" />
            <span>{jobs.length} opportunities</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search jobs..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            <Select
              value={filters.type || "all"}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-full sm:w-40 border-0 bg-muted/30">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.location || "all"}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="w-full sm:w-40 border-0 bg-muted/30">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              onClick={() => updateFilters({})}
              className="flex items-center gap-2 border-0 bg-muted/30"
            >
              <Filter className="w-4 h-4" />
              Clear
            </Button>
          </div>

          <div className="flex items-center justify-between">
            {/* Active Filters */}
            {(filters.search || filters.type || filters.location) && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    "{filters.search}"
                  </Badge>
                )}
                {filters.type && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {filters.type.replace("-", " ")}
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {filters.location}
                  </Badge>
                )}
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-muted/50 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-muted-foreground/70" />
          </div>
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search criteria or check back later for new
            opportunities.
          </p>
          <Button onClick={() => updateFilters({})} className="rounded-full">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              onView={setSelectedJob}
              isApplied={isApplied(job.id)}
              isApplying={applying === job.id}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          open={!!selectedJob}
          onOpenChange={() => setSelectedJob(null)}
          onApply={handleApply}
          isApplied={isApplied(selectedJob.id)}
          isApplying={applying === selectedJob.id}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Job } from "../types/careerTypes";
import { CareerApi } from "../api/careerApi";
import { useAuth } from "@/features/auth/components/AuthProvider";
import { toast } from "sonner";

interface JobFilters {
  search?: string;
  type?: string;
  location?: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { user } = useAuth();

  // Load jobs and user's applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch jobs
        const jobsData = await CareerApi.getJobs(filters);
        setJobs(jobsData);

        // Fetch user's applications
        if (user) {
          const applications = await CareerApi.getApplications();
          setAppliedJobs(applications.map((app) => app.job_id));
        }
      } catch (error) {
        console.error("Error fetching jobs data:", error);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, user]);

  const updateFilters = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const applyToJob = async (jobId: string) => {
    try {
      if (!user) {
        toast.error("Please sign in to apply for jobs");
        return;
      }

      const application = await CareerApi.applyToJob(jobId);
      setAppliedJobs((prev) => [...prev, application.job_id]);
      toast.success("Application submitted successfully!");
      return application;
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error("Failed to submit application");
      throw error;
    }
  };

  const isApplied = (jobId: string) => {
    return appliedJobs.includes(jobId);
  };

  return {
    jobs,
    loading,
    filters,
    updateFilters,
    applyToJob,
    isApplied,
  };
}

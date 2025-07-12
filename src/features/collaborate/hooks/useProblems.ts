import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Problem, ProblemFilters } from "../types/problems";

export function useProblems(
  filters: ProblemFilters = {
    domain: [],
    tags: [],
    status: [],
    timeline: "",
    difficulty: [],
    priority: [],
    remoteOnly: false,
    mentorshipAvailable: false,
    featured: false,
  }
) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      setError(null);
      try {
        const query = supabase.from("problems").select("*");
        // Add filter logic here if needed, e.g.:
        // if (filters.status) query = query.eq('status', filters.status);
        // if (filters.domain) query = query.eq('domain', filters.domain);
        const { data, error } = await query;
        if (error) throw error;
        setProblems(data as Problem[]);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch problems"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, [JSON.stringify(filters)]);

  return { problems, loading, error };
}

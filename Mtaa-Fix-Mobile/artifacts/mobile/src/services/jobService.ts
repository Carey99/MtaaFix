/**
 * Job API calls + React Query hooks.
 * Raw functions: jobApi.*
 * Hooks: useJobs, useMyJobs, useJob, useCreateJob
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import type { CreateJobPayload, Job } from '@/src/types';

const KEY = 'jobs';

// ─── Raw API ─────────────────────────────────────────────────────────────────

export const jobApi = {
  async getAll(): Promise<Job[]> {
    const res = await apiClient.get<Job[]>('/api/jobs/');
    return res.data;
  },

  async getMyJobs(): Promise<Job[]> {
    const res = await apiClient.get<Job[]>('/api/jobs/my-jobs/');
    return res.data;
  },

  async getById(id: string): Promise<Job> {
    const res = await apiClient.get<Job>(`/api/jobs/${id}/`);
    return res.data;
  },

  async create(payload: CreateJobPayload): Promise<Job> {
    const res = await apiClient.post<Job>('/api/jobs/', payload);
    return res.data;
  },
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useJobs() {
  return useQuery({ queryKey: [KEY, 'all'], queryFn: jobApi.getAll });
}

export function useMyJobs() {
  return useQuery({ queryKey: [KEY, 'mine'], queryFn: jobApi.getMyJobs });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => jobApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: jobApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

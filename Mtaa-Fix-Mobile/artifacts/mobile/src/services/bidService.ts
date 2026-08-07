/**
 * Bid / application API calls + React Query hooks.
 *
 * Worker applications are created via /api/jobs/applications/
 * and listed via /api/jobs/my-jobs/.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import type { Application, CreateBidPayload } from '@/src/types';

const KEY = 'bids';

// ─── Raw API ─────────────────────────────────────────────────────────────────

export const bidApi = {
  /** Create an application for a job (worker only). */
  async create(payload: CreateBidPayload): Promise<Application> {
    const res = await apiClient.post<Application>('/api/jobs/applications/', payload);
    return res.data;
  },

  async getMine(): Promise<Application[]> {
    const res = await apiClient.get<Application[]>('/api/jobs/my-jobs/');
    return res.data;
  },

  /** Client only: list every offer made on one of their jobs. */
  async getForJob(jobId: string): Promise<Application[]> {
    const res = await apiClient.get<Application[]>(`/api/jobs/applications/${jobId}/`);
    return res.data;
  },

  /** Client only: accept or reject one offer on their job. */
  async decide(jobId: string, applicationId: string, decision: 'accepted' | 'rejected'): Promise<Application> {
    const res = await apiClient.put<Application>(`/api/jobs/applications/${jobId}/`, {
      application_id: applicationId,
      status: decision,
    });
    return res.data;
  },
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Returns the authenticated worker's own applications.
 * The backend currently has no dedicated list endpoint for this —
 * returns empty array so the screen renders gracefully.
 */
export function useMyBids() {
  return useQuery<Application[]>({
    queryKey: [KEY, 'mine'],
    queryFn: bidApi.getMine,
  });
}

export function useCreateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bidApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

/** Client only: offers made on one of their jobs. */
export function useJobOffers(jobId: string) {
  return useQuery<Application[]>({
    queryKey: [KEY, 'for-job', jobId],
    queryFn: () => bidApi.getForJob(jobId),
    enabled: !!jobId,
  });
}

/** Client only: accept or reject an offer. Refreshes the offers list and the job itself
 * (since accepting flips job.status to 'assigned' and sets assigned_worker). */
export function useDecideOffer(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, decision }: { applicationId: string; decision: 'accepted' | 'rejected' }) =>
      bidApi.decide(jobId, applicationId, decision),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY, 'for-job', jobId] });
      qc.invalidateQueries({ queryKey: ['jobs', jobId] });
      qc.invalidateQueries({ queryKey: ['jobs', 'mine'] });
    },
  });
}
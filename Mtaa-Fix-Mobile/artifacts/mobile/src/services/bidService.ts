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

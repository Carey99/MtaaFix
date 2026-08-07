// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'client' | 'worker';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  name?: string;
}

/** Actual shape returned by POST /api/auth/login/ and /api/auth/register/ */
export interface AuthResponse {
  user: {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type JobCategory =
  | 'plumbing'
  | 'electrical'
  | 'moving'
  | 'cleaning'
  | 'fumigation'
  | 'installation'
  | 'carpentry'
  | 'delivery'
  | 'other';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory | string;
  location: string;
  budget: string; // API returns decimal string e.g. "2000.00"
  status: JobStatus;
  created_at: string;
  client?: User;
  assigned_worker?: User | null;
  applications_count?: number;
}

export type CreateJobPayload = {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
};

// ─── Applications / Bids ─────────────────────────────────────────────────────

export type ApplicationStatus = 'applied' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  job: Job;
  worker?: User;
  amount: string; 
  message: string;
  status: ApplicationStatus;
  applied_at: string; // API field name (not created_at)
}

export interface CreateBidPayload {
  job_id: string; // job UUID
  amount: string; 
  message: string;
}

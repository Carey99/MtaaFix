import apiClient from '../api/client';
import apiclient from '../api/client';

export const jobService = {
    // Get all jobs
    getJobs: async () => {
        const response = await apiClient.get('/api/jobs/');
        return response.data;
    },

    // Get job details
    getJobDetail: async () => {
        const response = await apiClient.get('/api/jobs/${jobId}');
        return response.data;
    },

    // Post a new job
    createJob: async (jobData) => {
        const response = await apiClient.post('/api/jobs/', jobData);
        return response.data;
    },

    // Get user's jobs
    getMyJobs: async () => {
        const response = await apiClient.get('/api/jobs/my-jobs/');
        return response.data;
    },

    // Apply for a job
    applyForJob: async (jobId, message) => {
        const response =  await apiClient.post('/api/applications/', {
            job: jobId,
            message: message,
        });
        return response.data;
    },

    // Get applications for a job
    getJobApplications: async (jobId) => {
        const response = await apiClient.get('/api/applications/${jobId}/');
        return response.data;
    },
};
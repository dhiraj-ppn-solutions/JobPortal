import api from "../api/axios";

// Submit a job application (Candidate only)
export const applyToJob = async (jobId, data) => {
  return await api.post(`/jobs/${jobId}/apply`, data);
};

// Get candidate's own applications history (Candidate only)
export const getCandidateApplications = async () => {
  return await api.get("/candidate/applications");
};

// Get all applications for a specific job opening (Employer only)
export const getJobApplications = async (jobId) => {
  return await api.get(`/jobs/${jobId}/applications`);
};

// Update status of an application (Employer only)
export const updateApplicationStatus = async (id, status) => {
  return await api.put(`/applications/${id}/status`, { status });
};

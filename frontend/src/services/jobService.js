import api from "../api/axios";

// Fetch jobs (supports search filters: keyword, location, job_type)
export const getJobs = async (params = {}) => {
  return await api.get("/jobs", { params });
};

// Fetch single job
export const getJobById = async (id) => {
  return await api.get(`/jobs/${id}`);
};

// Create a job opening (Employer only)
export const createJob = async (data) => {
  return await api.post("/jobs", data);
};

// Update an existing job opening (Employer only)
export const updateJob = async (id, data) => {
  return await api.put(`/jobs/${id}`, data);
};

// Delete a job opening (Employer only)
export const deleteJob = async (id) => {
  return await api.delete(`/jobs/${id}`);
};

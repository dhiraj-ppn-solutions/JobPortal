import api from "../api/axios";

// Get Admin overview statistics
export const getOverview = async () => {
  return await api.get("/admin/overview");
};

// List all registered users
export const getUsers = async () => {
  return await api.get("/admin/users");
};

// Delete user account and related items
export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

// List all job listings
export const getJobs = async () => {
  return await api.get("/admin/jobs");
};

// Delete a job listing
export const deleteJob = async (id) => {
  return await api.delete(`/admin/jobs/${id}`);
};

// List all applications
export const getApplications = async () => {
  return await api.get("/admin/applications");
};

// Delete an application record
export const deleteApplication = async (id) => {
  return await api.delete(`/admin/applications/${id}`);
};

// Create a new Administrator account
export const createNewAdmin = async (data) => {
  return await api.post("/admin/create-admin", data);
};

// Get list of all registered employers for verification
export const getEmployers = async () => {
  return await api.get("/admin/employers");
};

// Approve or reject an employer account
export const verifyEmployer = async (id, status) => {
  return await api.put(`/admin/employers/${id}/verify`, { status });
};

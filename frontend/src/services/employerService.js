import api from "../api/axios";

// Fetch employer dashboard metrics and analytics
export const getDashboardAnalytics = async () => {
  return await api.get("/employer/dashboard");
};

// Get employer verification details
export const getVerificationDetails = async () => {
  return await api.get("/employer/verify");
};

// Submit verification details (multipart)
export const submitVerificationDetails = async (formData) => {
  return await api.post("/employer/verify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

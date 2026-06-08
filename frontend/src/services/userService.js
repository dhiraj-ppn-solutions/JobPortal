import api from "../api/axios";

// Update candidate profile skills/experience/education
export const updateProfile = async (data) => {
  return await api.put("/candidate/profile", data);
};

// Upload resume file (PDF/DOC/DOCX) using FormData
export const uploadResume = async (formData) => {
  return await api.post("/candidate/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update general user account settings (name, email, password)
export const updateAccountSettings = async (data) => {
  return await api.put("/profile", data);
};


import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadResume, updateAccountSettings } from "../services/userService";

export const useProfileAndResume = () => {
  const { user, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    skills: "",
    experience: "",
    education: "",
  });
  const [accountData, setAccountData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [resumeMessage, setResumeMessage] = useState({ type: "", text: "" });
  const [accountMessage, setAccountMessage] = useState({ type: "", text: "" });

  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [resumeSubmitting, setResumeSubmitting] = useState(false);
  const [accountSubmitting, setAccountSubmitting] = useState(false);

  // Sync with context user profile and account details
  useEffect(() => {
    if (user) {
      setAccountData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      if (user.candidate_profile) {
        setProfileData({
          skills: user.candidate_profile.skills || "",
          experience: user.candidate_profile.experience || "",
          education: user.candidate_profile.education || "",
        });
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAccountChange = (e) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });
    setProfileSubmitting(true);

    try {
      const res = await updateProfile(profileData);
      if (res.data && res.data.success) {
        setProfileMessage({
          type: "success",
          text: "Profile details updated successfully!",
        });
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
      setProfileMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to update profile details.",
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountMessage({ type: "", text: "" });
    setAccountSubmitting(true);

    try {
      const payload = {
        name: accountData.name,
        email: accountData.email,
      };
      if (accountData.password) {
        payload.password = accountData.password;
      }
      const res = await updateAccountSettings(payload);
      if (res.data && res.data.success) {
        setAccountMessage({
          type: "success",
          text: "Account settings updated successfully!",
        });
        setAccountData((prev) => ({ ...prev, password: "" }));
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
      setAccountMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to update account settings.",
      });
    } finally {
      setAccountSubmitting(false);
    }
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setResumeMessage({
        type: "danger",
        text: "Please select a resume file first.",
      });
      return;
    }

    setResumeMessage({ type: "", text: "" });
    setResumeSubmitting(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await uploadResume(formData);
      if (res.data && res.data.success) {
        setResumeMessage({
          type: "success",
          text: "Resume uploaded successfully!",
        });
        setSelectedFile(null);
        // Clear file input manually
        const resumeInput = document.getElementById("resume-input");
        if (resumeInput) {
          resumeInput.value = "";
        }
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
      setResumeMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          "Failed to upload resume. Ensure it is a PDF/DOC/DOCX and less than 5MB.",
      });
    } finally {
      setResumeSubmitting(false);
    }
  };

  const currentResumeUrl = user?.candidate_profile?.resume_path
    ? `http://127.0.0.1:8000/storage/${user.candidate_profile.resume_path}`
    : null;

  return {
    user,
    profileData,
    accountData,
    profileMessage,
    resumeMessage,
    accountMessage,
    profileSubmitting,
    resumeSubmitting,
    accountSubmitting,
    selectedFile,
    currentResumeUrl,
    handleProfileChange,
    handleAccountChange,
    handleFileChange,
    handleProfileSubmit,
    handleAccountSubmit,
    handleResumeSubmit,
  };
};

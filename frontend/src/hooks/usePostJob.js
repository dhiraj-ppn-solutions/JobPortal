import { useState, useEffect } from "react";
import { createJob, updateJob } from "../services/jobService";

export const usePostJob = (jobToEdit, onSuccess) => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    salary: "",
    job_type: "Full-time",
    description: "",
    requirements: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || "",
        company_name: jobToEdit.company_name || "",
        location: jobToEdit.location || "",
        salary: jobToEdit.salary || "",
        job_type: jobToEdit.job_type || "Full-time",
        description: jobToEdit.description || "",
        requirements: jobToEdit.requirements || "",
        status: jobToEdit.status || "active",
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (jobToEdit) {
        const res = await updateJob(jobToEdit.id, formData);
        if (res.data && res.data.success) {
          setMessage({
            type: "success",
            text: "Job listing updated successfully!",
          });
          if (onSuccess) onSuccess();
        }
      } else {
        const res = await createJob(formData);
        if (res.data && res.data.success) {
          setMessage({
            type: "success",
            text: "Job listing created successfully!",
          });
          setFormData({
            title: "",
            company_name: "",
            location: "",
            salary: "",
            job_type: "Full-time",
            description: "",
            requirements: "",
            status: "active",
          });
          if (onSuccess) onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text:
          err.response?.data?.message || "Failed to save job listing details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    handleChange,
    handleSubmit,
  };
};

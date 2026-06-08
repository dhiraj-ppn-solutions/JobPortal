import { useState, useEffect } from "react";
import { getDashboardAnalytics } from "../services/employerService";
import { deleteJob } from "../services/jobService";

export const useManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getDashboardAnalytics();
      if (res.data && res.data.success) {
        setJobs(res.data.all_job_listings || []);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) {
      return;
    }

    setMessage({ type: "", text: "" });
    try {
      const res = await deleteJob(id);
      if (res.data && res.data.success) {
        setMessage({
          type: "success",
          text: "Job listing deleted successfully.",
        });
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to delete job listing." });
    }
  };

  return {
    jobs,
    loading,
    message,
    fetchJobs,
    handleDelete,
  };
};

import { useState, useEffect } from "react";
import { getJobs } from "../services/jobService";
import { applyToJob } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

export const useFindJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState({
    keyword: "",
    location: "",
    job_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Application details
  const [coverLetter, setCoverLetter] = useState("");
  const [appMessage, setAppMessage] = useState({ type: "", text: "" });
  const [applying, setApplying] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs(search);
      if (res.data && res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setCoverLetter("");
    setAppMessage({ type: "", text: "" });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user?.candidate_profile?.resume_path) {
      setAppMessage({
        type: "danger",
        text: "You must upload a CV in the 'Profile & Resume' tab before applying.",
      });
      return;
    }

    setAppMessage({ type: "", text: "" });
    setApplying(true);

    try {
      const res = await applyToJob(selectedJob.id, {
        cover_letter: coverLetter,
      });
      if (res.data && res.data.success) {
        setAppMessage({
          type: "success",
          text: "Application submitted successfully!",
        });
        setCoverLetter("");
      }
    } catch (err) {
      console.error(err);
      setAppMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          "Failed to submit application. You may have already applied to this job.",
      });
    } finally {
      setApplying(false);
    }
  };

  return {
    user,
    jobs,
    search,
    loading,
    selectedJob,
    coverLetter,
    appMessage,
    applying,
    handleSearchChange,
    handleSearchSubmit,
    handleSelectJob,
    handleApplySubmit,
    setCoverLetter,
    setSelectedJob,
  };
};

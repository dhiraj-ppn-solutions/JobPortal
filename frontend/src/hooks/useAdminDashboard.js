import { useState, useEffect } from "react";
import {
  getOverview,
  getUsers,
  deleteUser as apiDeleteUser,
  getJobs,
  deleteJob as apiDeleteJob,
  getApplications,
  deleteApplication as apiDeleteApplication,
  createNewAdmin,
} from "../services/adminService";

export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [overviewData, setOverviewData] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await getOverview();
      if (res.data && res.data.success) {
        setOverviewData(res.data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to fetch overview data." });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res.data && res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to fetch users." });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs();
      if (res.data && res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to fetch job listings." });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      if (res.data && res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to fetch applications." });
    } finally {
      setLoading(false);
    }
  };

  // Run on tab changes to load fresh data
  useEffect(() => {
    setMessage({ type: "", text: "" });
    if (activeTab === "dashboard") {
      fetchOverview();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "jobs") {
      fetchJobs();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all related records?")) {
      return;
    }
    setMessage({ type: "", text: "" });
    try {
      const res = await apiDeleteUser(id);
      if (res.data && res.data.success) {
        setMessage({ type: "success", text: "User account deleted successfully." });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to delete user.",
      });
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job and related applications?")) {
      return;
    }
    setMessage({ type: "", text: "" });
    try {
      const res = await apiDeleteJob(id);
      if (res.data && res.data.success) {
        setMessage({ type: "success", text: "Job listing deleted successfully." });
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to delete job.",
      });
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) {
      return;
    }
    setMessage({ type: "", text: "" });
    try {
      const res = await apiDeleteApplication(id);
      if (res.data && res.data.success) {
        setMessage({ type: "success", text: "Application deleted successfully." });
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to delete application.",
      });
    }
  };

  const handleCreateAdmin = async (adminData, onSuccessCallback) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await createNewAdmin(adminData);
      if (res.data && res.data.success) {
        setMessage({ type: "success", text: "New administrator created successfully!" });
        if (onSuccessCallback) onSuccessCallback();
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to create new admin account.",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    overviewData,
    users,
    jobs,
    applications,
    loading,
    message,
    handleDeleteUser,
    handleDeleteJob,
    handleDeleteApplication,
    handleCreateAdmin,
  };
};

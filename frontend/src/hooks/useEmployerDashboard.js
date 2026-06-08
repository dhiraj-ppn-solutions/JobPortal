import { useState, useEffect } from "react";
import { getDashboardAnalytics } from "../services/employerService";
import { updateApplicationStatus } from "../services/applicationService";

export const useEmployerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getDashboardAnalytics();
      if (res.data && res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setMessage({ type: "", text: "" });
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.data && res.data.success) {
        setMessage({
          type: "success",
          text: "Applicant status updated successfully!",
        });
        // Refresh analytics data
        await fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to update status." });
    } finally {
      setUpdatingId(null);
    }
  };

  const analytics = data?.analytics;
  const recentApps = data?.recent_applications || [];
  const statusBreakdown = analytics?.status_breakdown || {};

  return {
    analytics,
    recentApps,
    statusBreakdown,
    loading,
    updatingId,
    message,
    fetchAnalytics,
    handleStatusChange,
  };
};

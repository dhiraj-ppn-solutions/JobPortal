import { useState, useEffect } from "react";
import { getCandidateApplications } from "../services/applicationService";

export const useCandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getCandidateApplications();
      if (res.data && res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    refetch: fetchApplications,
  };
};

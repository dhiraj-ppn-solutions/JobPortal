import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { logout as apiLogout } from "../../services/authService";
import UserLayout from "../../layouts/UserLayout";

// Candidate views
import FindJobs from "./FindJobs";
import CandidateApplications from "./CandidateApplications";
import ProfileAndResume from "./ProfileAndResume";

// Employer views
import EmployerDashboard from "./EmployerDashboard";
import PostJob from "./PostJob";
import ManageJobs from "./ManageJobs";
import EmployerProfile from "./EmployerProfile";
import VerifyCompanyForm from "../../components/user/VerifyCompanyForm";

function UserDashboard() {
  const { user, logout: localLogout } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [editJob, setEditJob] = useState(null);

  // Set default active tab based on user role and approval status
  useEffect(() => {
    if (user) {
      if (user.role === "employer") {
        if (user.employer_status === "approved") {
          setActiveTab("employer_dashboard");
        } else {
          setActiveTab("verify_company");
        }
      } else {
        setActiveTab("find_jobs");
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localLogout();
    }
  };

  const handleEditJob = (job) => {
    setEditJob(job);
    setActiveTab("post_job");
  };

  const handleJobSaveSuccess = () => {
    setEditJob(null);
    setActiveTab("manage_jobs");
  };

  const renderContent = () => {
    switch (activeTab) {
      // Candidate views
      case "find_jobs":
        return <FindJobs />;
      case "applications":
        return <CandidateApplications />;
      case "profile":
        return user?.role === "employer" ? <EmployerProfile /> : <ProfileAndResume />;

      // Employer views
      case "employer_dashboard":
        return user?.employer_status === "approved" ? <EmployerDashboard /> : <VerifyCompanyForm />;
      case "post_job":
        return user?.employer_status === "approved" ? (
          <PostJob jobToEdit={editJob} onSuccess={handleJobSaveSuccess} />
        ) : (
          <VerifyCompanyForm />
        );
      case "manage_jobs":
        return user?.employer_status === "approved" ? (
          <ManageJobs onEditJob={handleEditJob} />
        ) : (
          <VerifyCompanyForm />
        );
      case "verify_company":
        return <VerifyCompanyForm />;

      default:
        return <p>Loading workspace panel...</p>;
    }
  };

  return (
    <UserLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setEditJob={setEditJob}
      user={user}
      handleLogout={handleLogout}
    >
      {renderContent()}
    </UserLayout>
  );
}

export default UserDashboard;
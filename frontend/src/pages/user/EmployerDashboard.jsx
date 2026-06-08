import { useEmployerDashboard } from "../../hooks/useEmployerDashboard";
import UserHeader from "../../components/user/UserHeader";
import DashboardStats from "../../components/user/DashboardStats";
import PipelineBreakdown from "../../components/user/PipelineBreakdown";
import RecentApplicantsList from "../../components/user/RecentApplicantsList";

function EmployerDashboard() {
  const {
    analytics,
    recentApps,
    statusBreakdown,
    loading,
    updatingId,
    message,
    handleStatusChange,
  } = useEmployerDashboard();

  if (loading && !analytics) {
    return (
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Loading dashboard...
      </p>
    );
  }

  return (
    <div>
      <UserHeader
        title="Hiring Dashboard"
        subtitle="Monitor your postings and applicant pipelines"
      />

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {/* Analytics Cards Grid */}
      <DashboardStats analytics={analytics} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr",
          gap: "2.5rem",
          marginTop: "2.5rem",
        }}
      >
        {/* Status Breakdown Panel */}
        <PipelineBreakdown statusBreakdown={statusBreakdown} />

        {/* Recent Applications Panel */}
        <RecentApplicantsList
          recentApps={recentApps}
          updatingId={updatingId}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}

export default EmployerDashboard;

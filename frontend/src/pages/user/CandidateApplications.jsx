import { useCandidateApplications } from "../../hooks/useCandidateApplications";
import ApplicationHistoryTable from "../../components/user/ApplicationHistoryTable";

function CandidateApplications() {
  const { applications, loading } = useCandidateApplications();

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Application History</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Track the status of your submitted job applications
      </p>

      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
          Loading applications...
        </p>
      ) : (
        <ApplicationHistoryTable applications={applications} />
      )}
    </div>
  );
}

export default CandidateApplications;

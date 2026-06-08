import { useManageJobs } from "../../hooks/useManageJobs";
import JobOpeningsTable from "../../components/user/JobOpeningsTable";

function ManageJobs({ onEditJob }) {
  const { jobs, loading, message, handleDelete } = useManageJobs();

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Manage Openings</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Edit details or close active job openings
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
          Loading your listings...
        </p>
      ) : (
        <JobOpeningsTable
          jobs={jobs}
          onEditJob={onEditJob}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ManageJobs;

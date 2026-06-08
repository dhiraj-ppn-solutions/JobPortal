function AdminJobsList({ jobs, handleDeleteJob }) {
  const getBadgeClassName = (status) => {
    return status === "active" ? "badge badge-shortlisted" : "badge badge-inactive";
  };

  if (jobs.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          padding: "3rem",
          textAlign: "center",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        No job listings exist in the system.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>All Job Listings</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <th style={{ padding: "1rem" }}>Job Opening</th>
              <th style={{ padding: "1rem" }}>Company</th>
              <th style={{ padding: "1rem" }}>Location & Type</th>
              <th style={{ padding: "1rem" }}>Salary</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.01)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <td style={{ padding: "1.25rem 1rem", fontWeight: "600" }}>
                  {job.title}
                </td>
                <td style={{ padding: "1.25rem 1rem", color: "var(--primary)" }}>
                  {job.company_name}
                </td>
                <td
                  style={{
                    padding: "1.25rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  📍 {job.location} | {job.job_type}
                </td>
                <td
                  style={{
                    padding: "1.25rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {job.salary || "N/A"}
                </td>
                <td style={{ padding: "1.25rem 1rem" }}>
                  <span className={getBadgeClassName(job.status)}>{job.status}</span>
                </td>
                <td style={{ padding: "1.25rem 1rem", textAlign: "right" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDeleteJob(job.id)}
                    style={{
                      width: "auto",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      color: "#f87171",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminJobsList;

function JobOpeningsTable({ jobs, onEditJob, handleDelete }) {
  const getBadgeClassName = (status) => {
    return status === "active" ? "badge badge-shortlisted" : "badge badge-inactive";
  };

  if (jobs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-muted)",
        }}
      >
        You haven't posted any job openings yet.
      </div>
    );
  }

  return (
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
            <th style={{ padding: "1rem" }}>Title</th>
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
              <td style={{ padding: "1.25rem 1rem" }}>
                <div style={{ fontWeight: "600", color: "var(--text-main)" }}>
                  {job.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
                  {job.company_name}
                </div>
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
                {job.salary}
              </td>
              <td style={{ padding: "1.25rem 1rem" }}>
                <span className={getBadgeClassName(job.status)}>{job.status}</span>
              </td>
              <td style={{ padding: "1.25rem 1rem", textAlign: "right" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEditJob(job)}
                    style={{
                      width: "auto",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDelete(job.id)}
                    style={{
                      width: "auto",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      color: "#f87171",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobOpeningsTable;

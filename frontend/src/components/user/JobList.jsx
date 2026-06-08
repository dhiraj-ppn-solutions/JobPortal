function JobList({ jobs, loading, selectedJob, handleSelectJob }) {
  if (loading) {
    return (
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Searching jobs...
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          background: "var(--card-bg)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          No jobs found. Try adjusting your search keywords.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => handleSelectJob(job)}
          style={{
            background:
              selectedJob?.id === job.id
                ? "rgba(99, 102, 241, 0.08)"
                : "var(--card-bg)",
            border:
              selectedJob?.id === job.id
                ? "1px solid var(--primary)"
                : "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.5rem",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              {job.title}
            </h3>
            <span
              style={{
                fontSize: "0.8rem",
                background: "rgba(255,255,255,0.05)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                color: "var(--text-muted)",
              }}
            >
              {job.job_type}
            </span>
          </div>
          <p
            style={{
              color: "var(--primary)",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginTop: "0.25rem",
            }}
          >
            {job.company_name}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            📍 {job.location} | 💰 {job.salary || "Not specified"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default JobList;

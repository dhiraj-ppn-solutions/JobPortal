function RecentApplicantsList({
  recentApps,
  updatingId,
  handleStatusChange,
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>Recent Applicants</h2>

      {recentApps.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {recentApps.map((app) => (
            <div
              key={app.id}
              style={{
                background: "rgba(255, 255, 255, 0.01)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "var(--text-main)",
                    }}
                  >
                    {app.candidate?.name}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    📧 {app.candidate?.email}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--primary)",
                    fontWeight: "600",
                  }}
                >
                  Applying for: {app.job_listing?.title}
                </div>
              </div>

              {/* Candidate Profile Info */}
              {app.candidate?.candidate_profile && (
                <div
                  style={{
                    margin: "1rem 0",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  <div>
                    <strong>Skills:</strong>{" "}
                    <span style={{ color: "var(--text-muted)" }}>
                      {app.candidate.candidate_profile.skills || "N/A"}
                    </span>
                  </div>
                  <div style={{ marginTop: "0.25rem" }}>
                    <strong>Experience:</strong>{" "}
                    <span style={{ color: "var(--text-muted)" }}>
                      {app.candidate.candidate_profile.experience || "N/A"}
                    </span>
                  </div>
                </div>
              )}

              {app.cover_letter && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    margin: "0.75rem 0",
                    borderLeft: "2px solid var(--primary)",
                    paddingLeft: "0.75rem",
                  }}
                >
                  "{app.cover_letter}"
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                {app.resume_path ? (
                  <a
                    href={`http://127.0.0.1:8000/storage/${app.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    📄 Download CV
                  </a>
                ) : (
                  <span style={{ color: "red", fontSize: "0.8rem" }}>
                    No CV available
                  </span>
                )}

                {/* Status Update Selection */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ margin: 0, fontSize: "0.75rem" }}>
                    Status:
                  </label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={updatingId === app.id}
                    style={{
                      width: "140px",
                      padding: "0.4rem 2rem 0.4rem 0.75rem",
                      fontSize: "0.85rem",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="applied">Applied</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No applications received yet.
        </p>
      )}
    </div>
  );
}

export default RecentApplicantsList;

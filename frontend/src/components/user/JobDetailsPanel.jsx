function JobDetailsPanel({
  selectedJob,
  setSelectedJob,
  coverLetter,
  setCoverLetter,
  appMessage,
  applying,
  handleApplySubmit,
}) {
  if (!selectedJob) return null;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        position: "sticky",
        top: "2rem",
        height: "fit-content",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h2>{selectedJob.title}</h2>
        <button
          onClick={() => setSelectedJob(null)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
      <p
        style={{
          color: "var(--primary)",
          fontWeight: "600",
          fontSize: "1.1rem",
          marginBottom: "0.5rem",
        }}
      >
        {selectedJob.company_name}
      </p>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          marginBottom: "1.5rem",
        }}
      >
        📍 {selectedJob.location} | 💰 {selectedJob.salary || "N/A"} | 📁{" "}
        {selectedJob.job_type}
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            color: "var(--text-main)",
            marginBottom: "0.5rem",
          }}
        >
          Description
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            whiteSpace: "pre-line",
          }}
        >
          {selectedJob.description}
        </p>
      </div>

      {selectedJob.requirements && (
        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--text-main)",
              marginBottom: "0.5rem",
            }}
          >
            Requirements
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              whiteSpace: "pre-line",
            }}
          >
            {selectedJob.requirements}
          </p>
        </div>
      )}

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border)",
          margin: "1.5rem 0",
        }}
      />

      {/* Apply Form */}
      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Apply for this Role
        </h3>

        {appMessage.text && (
          <div className={`alert alert-${appMessage.type}`}>
            {appMessage.text}
          </div>
        )}

        <form onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              placeholder="Introduce yourself to the hiring team..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={applying}
          >
            {applying ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobDetailsPanel;

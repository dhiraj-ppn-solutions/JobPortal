function ResumeUploader({
  user,
  resumeMessage,
  resumeSubmitting,
  currentResumeUrl,
  handleFileChange,
  handleResumeSubmit,
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Resume Attachment</h2>
      <p className="text-muted">
        Upload your latest CV (PDF, DOC, DOCX up to 5MB)
      </p>

      {resumeMessage.text && (
        <div className={`alert alert-${resumeMessage.type}`}>
          {resumeMessage.text}
        </div>
      )}

      <form onSubmit={handleResumeSubmit} style={{ marginBottom: "2rem" }}>
        <div className="form-group">
          <label>Select CV Document</label>
          <input
            id="resume-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ padding: "0.5rem 0" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={resumeSubmitting}
        >
          {resumeSubmitting ? "Uploading..." : "Upload New CV"}
        </button>
      </form>

      <div
        style={{
          marginTop: "auto",
          padding: "1.5rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
        }}
      >
        <label style={{ marginBottom: "0.75rem", display: "block" }}>
          Active CV File
        </label>
        {currentResumeUrl ? (
          <div>
            <p
              style={{
                color: "#60a5fa",
                fontSize: "0.95rem",
                marginBottom: "1rem",
                wordBreak: "break-all",
              }}
            >
              📄 {user?.candidate_profile?.resume_path?.split("/").pop()}
            </p>
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{
                width: "auto",
                display: "inline-flex",
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
              }}
            >
              Download Resume
            </a>
          </div>
        ) : (
          <p style={{ color: "red", fontSize: "0.9rem" }}>
            No resume uploaded yet. You must upload a resume before you can
            apply for jobs.
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeUploader;

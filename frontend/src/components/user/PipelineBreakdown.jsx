function PipelineBreakdown({ statusBreakdown }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        height: "fit-content",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Pipeline Breakdown</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "#60a5fa", fontWeight: "600" }}>Applied</span>
          <span style={{ fontWeight: "700" }}>
            {statusBreakdown.applied || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "#fbbf24", fontWeight: "600" }}>
            Reviewing
          </span>
          <span style={{ fontWeight: "700" }}>
            {statusBreakdown.reviewing || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "#34d399", fontWeight: "600" }}>
            Shortlisted
          </span>
          <span style={{ fontWeight: "700" }}>
            {statusBreakdown.shortlisted || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "#10b981", fontWeight: "600" }}>Accepted</span>
          <span style={{ fontWeight: "700" }}>
            {statusBreakdown.accepted || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "#f87171", fontWeight: "600" }}>Rejected</span>
          <span style={{ fontWeight: "700" }}>
            {statusBreakdown.rejected || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PipelineBreakdown;

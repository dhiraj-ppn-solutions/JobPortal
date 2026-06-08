function ApplicationHistoryTable({ applications }) {
  const getBadgeClassName = (status) => {
    switch (status) {
      case "applied":
        return "badge badge-applied";
      case "reviewing":
        return "badge badge-reviewing";
      case "shortlisted":
        return "badge badge-shortlisted";
      case "accepted":
        return "badge badge-accepted";
      case "rejected":
        return "badge badge-rejected";
      default:
        return "badge badge-inactive";
    }
  };

  if (applications.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-muted)",
        }}
      >
        You haven't submitted any job applications yet.
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
            <th style={{ padding: "1rem" }}>Role & Company</th>
            <th style={{ padding: "1rem" }}>Submitted On</th>
            <th style={{ padding: "1rem" }}>Cover Letter</th>
            <th style={{ padding: "1rem" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
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
                  {app.job_listing?.title || "N/A"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--primary)" }}>
                  {app.job_listing?.company_name || "N/A"}
                </div>
              </td>
              <td
                style={{
                  padding: "1.25rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                }}
              >
                {new Date(app.created_at).toLocaleDateString()}
              </td>
              <td
                style={{
                  padding: "1.25rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  maxWidth: "250px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={app.cover_letter}
              >
                {app.cover_letter || "N/A"}
              </td>
              <td style={{ padding: "1.25rem 1rem" }}>
                <span className={getBadgeClassName(app.status)}>{app.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationHistoryTable;

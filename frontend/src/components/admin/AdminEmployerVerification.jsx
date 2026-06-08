import { useState, useEffect } from "react";
import { getEmployers, verifyEmployer } from "../../services/adminService";

function AdminEmployerVerification() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchEmployersList = async () => {
    try {
      const res = await getEmployers();
      if (res.data && res.data.success) {
        setEmployers(res.data.employers || []);
      }
    } catch (err) {
      console.error("Failed to load employers", err);
      setMessage({ type: "danger", text: "Failed to load employers list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployersList();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const actionText = status === "approved" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${actionText} this employer?`)) {
      return;
    }

    setMessage({ type: "", text: "" });
    try {
      const res = await verifyEmployer(id, status);
      if (res.data && res.data.success) {
        setMessage({
          type: "success",
          text: res.data.message || `Employer has been ${status} successfully.`,
        });
        await fetchEmployersList();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || `Failed to update employer status.`,
      });
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Loading registered employers...</p>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="badge badge-active">Approved</span>;
      case "rejected":
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge badge-inactive">Pending</span>;
    }
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Verify Employers</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        Review company details, credentials, and verification papers to approve job posting access
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: "2rem" }}>
          {message.text}
        </div>
      )}

      {employers.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "1rem" }}>Employer Info</th>
                <th style={{ padding: "1rem" }}>Company Profile</th>
                <th style={{ padding: "1rem" }}>Submitted Document</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((emp) => (
                <tr
                  key={emp.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.01)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  {/* Employer Info */}
                  <td style={{ padding: "1.25rem 1rem", verticalAlign: "top" }}>
                    <div style={{ fontWeight: "600", color: "var(--text-main)" }}>{emp.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{emp.email}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Registered: {new Date(emp.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Company Profile */}
                  <td style={{ padding: "1.25rem 1rem", verticalAlign: "top", maxWidth: "300px" }}>
                    {emp.company_name ? (
                      <>
                        <div style={{ fontWeight: "600", color: "var(--primary)" }}>{emp.company_name}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          <a href={emp.company_website} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                            {emp.company_website}
                          </a>
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-main)",
                            whiteSpace: "pre-line",
                            maxHeight: "100px",
                            overflowY: "auto",
                            borderLeft: "2px solid var(--border)",
                            paddingLeft: "0.5rem",
                          }}
                        >
                          {emp.company_description}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                        Details not submitted yet
                      </span>
                    )}
                  </td>

                  {/* Submitted Document */}
                  <td style={{ padding: "1.25rem 1rem", verticalAlign: "top" }}>
                    {emp.company_document_url ? (
                      <a
                        href={emp.company_document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.85rem",
                        }}
                      >
                        📄 View Document
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                        No file uploaded
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "1.25rem 1rem", verticalAlign: "top" }}>{getStatusBadge(emp.employer_status)}</td>

                  {/* Actions */}
                  <td style={{ padding: "1.25rem 1rem", verticalAlign: "top", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      {emp.employer_status !== "approved" && emp.company_name && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleStatusUpdate(emp.id, "approved")}
                          style={{
                            width: "auto",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.85rem",
                            background: "#22c55e",
                            borderColor: "#22c55e",
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {emp.employer_status !== "rejected" && emp.company_name && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleStatusUpdate(emp.id, "rejected")}
                          style={{
                            width: "auto",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.85rem",
                            color: "#ef4444",
                            borderColor: "var(--border)",
                          }}
                        >
                          Reject
                        </button>
                      )}
                      {!emp.company_name && (
                        <span className="text-muted" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                          Awaiting Submission
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No employers registered on the site.</p>
      )}
    </div>
  );
}

export default AdminEmployerVerification;

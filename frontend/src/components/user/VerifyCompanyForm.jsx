import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getVerificationDetails, submitVerificationDetails } from "../../services/employerService";

function VerifyCompanyForm() {
  const { refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    company_description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState(null);
  const [employerStatus, setEmployerStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await getVerificationDetails();
        if (res.data && res.data.success) {
          setFormData({
            company_name: res.data.company_name || "",
            company_website: res.data.company_website || "",
            company_description: res.data.company_description || "",
          });
          setCurrentDocumentUrl(res.data.company_document_url);
          setEmployerStatus(res.data.employer_status || "pending");
        }
      } catch (err) {
        console.error("Failed to load verification details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSubmitting(true);

    const submissionData = new FormData();
    submissionData.append("company_name", formData.company_name);
    submissionData.append("company_website", formData.company_website);
    submissionData.append("company_description", formData.company_description);
    if (selectedFile) {
      submissionData.append("company_document", selectedFile);
    }

    try {
      const res = await submitVerificationDetails(submissionData);
      if (res.data && res.data.success) {
        setMessage({
          type: "success",
          text: res.data.message || "Verification details submitted successfully!",
        });
        setEmployerStatus("pending");
        setCurrentDocumentUrl(res.data.company_document_url);
        setSelectedFile(null);
        // Clear file input
        const docInput = document.getElementById("company-document-input");
        if (docInput) {
          docInput.value = "";
        }
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to submit verification details.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Loading verification details...</p>;
  }

  const getStatusBadge = () => {
    switch (employerStatus) {
      case "approved":
        return <span className="badge badge-active" style={{ textTransform: "uppercase" }}>Approved</span>;
      case "rejected":
        return <span className="badge badge-rejected" style={{ textTransform: "uppercase" }}>Rejected</span>;
      default:
        return <span className="badge badge-inactive" style={{ textTransform: "uppercase" }}>Pending Verification</span>;
    }
  };

  const getStatusCard = () => {
    if (employerStatus === "approved") {
      return (
        <div className="alert alert-success" style={{ marginBottom: "2rem" }}>
          <strong>✓ Approved:</strong> Your company has been verified by our administrator. All employer features are unlocked.
        </div>
      );
    } else if (employerStatus === "rejected") {
      return (
        <div className="alert alert-danger" style={{ marginBottom: "2rem" }}>
          <strong>✗ Verification Rejected:</strong> Your company verification was rejected. Please review the details below, upload valid documentation, and resubmit.
        </div>
      );
    } else if (formData.company_name) {
      return (
        <div className="alert alert-warning" style={{ marginBottom: "2rem" }}>
          <strong>⏳ Awaiting Review:</strong> Your verification documents are currently pending review by our administrator.
        </div>
      );
    } else {
      return (
        <div className="alert alert-info" style={{ marginBottom: "2rem" }}>
          <strong>🏢 Action Required:</strong> Please submit your company verification details and document below to unlock the job board tools.
        </div>
      );
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {getStatusCard()}

      <div
        style={{
          background: "var(--card-bg)",
          padding: "2.5rem",
          borderRadius: "16px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0 }}>Company Details & Verification</h2>
          {getStatusBadge()}
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: "1.5rem" }}>
            {message.text}
          </div>
        )}

        {employerStatus === "pending" || employerStatus === "approved" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Registered Company Name</label>
              <div style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem", color: "var(--text-main)" }}>{formData.company_name}</div>
            </div>

            <div>
              <label style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Official Company Website</label>
              <div style={{ marginTop: "0.25rem" }}>
                <a href={formData.company_website} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: "500" }}>
                  {formData.company_website}
                </a>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Company Description</label>
              <div style={{ marginTop: "0.25rem", whiteSpace: "pre-line", lineHeight: "1.6", color: "var(--text-main)" }}>{formData.company_description}</div>
            </div>

            {currentDocumentUrl && (
              <div>
                <label style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Verification Document</label>
                <a
                  href={currentDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ display: "inline-block", width: "auto", fontSize: "0.9rem", padding: "0.5rem 1rem" }}
                >
                  📄 View Submitted Document
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Registered Company Name</label>
              <input
                type="text"
                name="company_name"
                placeholder="e.g. Acme Corporation"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Official Company Website</label>
              <input
                type="url"
                name="company_website"
                placeholder="https://acme.com"
                value={formData.company_website}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company Description</label>
              <textarea
                name="company_description"
                placeholder="Brief overview of company business model, industry sector, and workforce size..."
                value={formData.company_description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Verification Document (PDF, PNG, JPG, JPEG, DOC, DOCX)</label>
              <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "-0.25rem", marginBottom: "0.75rem" }}>
                Submit an official registration paper, utility bill, or document proving company authenticity. Max 5MB.
              </p>
              <input
                type="file"
                id="company-document-input"
                onChange={handleFileChange}
                required={!currentDocumentUrl}
              />
              
              {currentDocumentUrl && (
                <div style={{ marginTop: "1rem" }}>
                  <a
                    href={currentDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ display: "inline-block", width: "auto", fontSize: "0.9rem", padding: "0.5rem 1rem" }}
                  >
                    📄 View Submitted Document
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: "1rem" }}
            >
              {submitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default VerifyCompanyForm;

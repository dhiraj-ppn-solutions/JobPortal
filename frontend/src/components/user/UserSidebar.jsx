function UserSidebar({ activeTab, setActiveTab, setEditJob, user, handleLogout }) {
  const isEmployer = user?.role === "employer";

  return (
    <div className="sidebar">
      <h3>Portal Workspace</h3>
      <p className="text-muted" style={{ fontSize: "0.8rem", textTransform: "capitalize", marginBottom: "2rem" }}>
        Logged as: {user?.role}
      </p>

      <div className="sidebar-nav">
        {!isEmployer ? (
          <>
            <button
              className={`sidebar-link btn-secondary ${activeTab === "find_jobs" ? "active" : ""}`}
              onClick={() => { setActiveTab("find_jobs"); setEditJob(null); }}
              style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              🔍 Find Opportunities
            </button>
            <button
              className={`sidebar-link btn-secondary ${activeTab === "applications" ? "active" : ""}`}
              onClick={() => { setActiveTab("applications"); setEditJob(null); }}
              style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              📁 My Applications
            </button>
            <button
              className={`sidebar-link btn-secondary ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => { setActiveTab("profile"); setEditJob(null); }}
              style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              📄 Profile & CV
            </button>
          </>
        ) : (
          <>
            {user?.employer_status === "approved" ? (
              <>
                <button
                  className={`sidebar-link btn-secondary ${activeTab === "employer_dashboard" ? "active" : ""}`}
                  onClick={() => { setActiveTab("employer_dashboard"); setEditJob(null); }}
                  style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  📊 Overview Dashboard
                </button>
                <button
                  className={`sidebar-link btn-secondary ${activeTab === "post_job" ? "active" : ""}`}
                  onClick={() => { setActiveTab("post_job"); }}
                  style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  ✍️ Post a New Job
                </button>
                <button
                  className={`sidebar-link btn-secondary ${activeTab === "manage_jobs" ? "active" : ""}`}
                  onClick={() => { setActiveTab("manage_jobs"); setEditJob(null); }}
                  style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  ⚙️ Manage Openings
                </button>
              </>
            ) : (
              <button
                className={`sidebar-link btn-secondary ${activeTab === "verify_company" ? "active" : ""}`}
                onClick={() => { setActiveTab("verify_company"); setEditJob(null); }}
                style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
              >
                🏢 Verify Company
              </button>
            )}
            <button
              className={`sidebar-link btn-secondary ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => { setActiveTab("profile"); setEditJob(null); }}
              style={{ border: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              👤 Account Settings
            </button>
          </>
        )}
      </div>

      <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: "auto" }}>
        Log Out
      </button>
    </div>
  );
}

export default UserSidebar;

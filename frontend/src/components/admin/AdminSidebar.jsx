function AdminSidebar({ activeTab, setActiveTab, user, handleLogout }) {
  return (
    <div className="sidebar">
      <h3>Admin Portal</h3>
      <p
        className="text-muted"
        style={{
          fontSize: "0.8rem",
          textTransform: "capitalize",
          marginBottom: "2rem",
        }}
      >
        Logged as: {user?.role || "Admin"}
      </p>
      <div className="sidebar-nav">
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          📊 Dashboard Overview
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "users" ? "active" : ""
          }`}
          onClick={() => setActiveTab("users")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          👥 Manage Users
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "add_admin" ? "active" : ""
          }`}
          onClick={() => setActiveTab("add_admin")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          ➕ Add Admin
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "verify_employers" ? "active" : ""
          }`}
          onClick={() => setActiveTab("verify_employers")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          🏢 Verify Employers
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "jobs" ? "active" : ""
          }`}
          onClick={() => setActiveTab("jobs")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          💼 Job Listings
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "applications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("applications")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          📁 Job Applications
        </button>
        <button
          className={`sidebar-link btn-secondary ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveTab("profile")}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          👤 Admin Settings
        </button>
      </div>
      <button
        className="btn btn-secondary"
        onClick={handleLogout}
        style={{ marginTop: "auto" }}
      >
        Log Out
      </button>
    </div>
  );
}

export default AdminSidebar;

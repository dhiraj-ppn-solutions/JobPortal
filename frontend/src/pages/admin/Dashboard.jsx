import { useAuth } from "../../context/AuthContext";
import { logout as apiLogout } from "../../services/authService";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboardStats from "../../components/admin/AdminDashboardStats";
import AdminUsersList from "../../components/admin/AdminUsersList";
import AdminJobsList from "../../components/admin/AdminJobsList";
import AdminApplicationsList from "../../components/admin/AdminApplicationsList";
import AdminProfile from "./AdminProfile";
import AdminProvisionForm from "../../components/admin/AdminProvisionForm";
import AdminEmployerVerification from "../../components/admin/AdminEmployerVerification";

function AdminDashboard() {
  const { user, logout: localLogout } = useAuth();
  const {
    activeTab,
    setActiveTab,
    overviewData,
    users,
    jobs,
    applications,
    loading,
    message,
    handleDeleteUser,
    handleDeleteJob,
    handleCreateAdmin,
  } = useAdminDashboard();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localLogout();
    }
  };

  const renderContent = () => {
    if (loading && !overviewData && activeTab === "dashboard") {
      return (
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
          Loading stats...
        </p>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <AdminDashboardStats analytics={overviewData?.analytics} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr",
                gap: "2.5rem",
              }}
            >
              {/* Recent Users */}
              <div
                style={{
                  background: "var(--card-bg)",
                  padding: "2rem",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                }}
              >
                <h2 style={{ marginBottom: "1rem" }}>Recent Registrations</h2>
                {overviewData?.recent_users?.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {overviewData.recent_users.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0.75rem 0",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "600" }}>{u.name}</div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {u.email}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            textTransform: "uppercase",
                            color: "var(--primary)",
                            fontWeight: "600",
                          }}
                        >
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)" }}>
                    No registrations yet.
                  </p>
                )}
              </div>

              {/* Recent Jobs */}
              <div
                style={{
                  background: "var(--card-bg)",
                  padding: "2rem",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                }}
              >
                <h2 style={{ marginBottom: "1rem" }}>Recent Job Listings</h2>
                {overviewData?.recent_jobs?.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {overviewData.recent_jobs.map((j) => (
                      <div
                        key={j.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0.75rem 0",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "600" }}>{j.title}</div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {j.company_name}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--secondary)",
                            fontWeight: "600",
                          }}
                        >
                          {j.job_type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)" }}>
                    No listings yet.
                  </p>
                )}
              </div>
            </div>
          </>
        );

      case "users":
        return (
          <AdminUsersList
            users={users}
            currentUser={user}
            handleDeleteUser={handleDeleteUser}
          />
        );

      case "add_admin":
        return (
          <AdminProvisionForm
            handleCreateAdmin={handleCreateAdmin}
          />
        );

      case "jobs":
        return <AdminJobsList jobs={jobs} handleDeleteJob={handleDeleteJob} />;

      case "applications":
        return (
          <AdminApplicationsList
            applications={applications}
          />
        );

      case "profile":
        return <AdminProfile />;

      case "verify_employers":
        return <AdminEmployerVerification />;

      default:
        return <p>Loading admin panel...</p>;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      handleLogout={handleLogout}
    >
      <AdminHeader
        title="Admin Control Center"
        subtitle={
          activeTab === "dashboard"
            ? "Monitor site statistics and active databases"
            : activeTab === "users"
            ? "Manage all registered user accounts"
            : activeTab === "add_admin"
            ? "Create a new administrative user"
            : activeTab === "verify_employers"
            ? "Verify registered employer accounts and documents"
            : activeTab === "jobs"
            ? "Moderate active company job postings"
            : activeTab === "applications"
            ? "Review and manage candidate applications"
            : "Update your administrator credentials"
        }
      />

      {message.text && (
        <div
          className={`alert alert-${message.type}`}
          style={{ marginBottom: "2rem" }}
        >
          {message.text}
        </div>
      )}

      {renderContent()}
    </AdminLayout>
  );
}

export default AdminDashboard;
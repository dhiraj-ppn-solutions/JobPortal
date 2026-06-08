function AdminUsersList({ users, currentUser, handleDeleteUser }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>Manage Users</h2>
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
              <th style={{ padding: "1rem" }}>User Info</th>
              <th style={{ padding: "1rem" }}>Role</th>
              <th style={{ padding: "1rem" }}>Member Since</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
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
                    {user.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {user.email}
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1rem", fontSize: "0.9rem" }}>
                  <span
                    className={`badge badge-${user.role}`}
                    style={{ textTransform: "uppercase" }}
                  >
                    {user.role}
                  </span>
                </td>
                <td
                  style={{
                    padding: "1.25rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: "1.25rem 1rem", textAlign: "right" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={currentUser?.id === user.id}
                    style={{
                      width: "auto",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      color:
                        currentUser?.id === user.id
                          ? "var(--text-muted)"
                          : "#f87171",
                      cursor:
                        currentUser?.id === user.id ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersList;

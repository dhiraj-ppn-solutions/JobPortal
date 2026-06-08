function AdminDashboardStats({ analytics }) {
  return (
    <div className="stats-grid" style={{ marginBottom: "2.5rem" }}>
      <div className="stat-card">
        <h3>Candidates</h3>
        <p>{analytics?.total_candidates || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Employers</h3>
        <p>{analytics?.total_employers || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Admins</h3>
        <p>{analytics?.total_admins || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Job Listings</h3>
        <p>{analytics?.total_jobs || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Applications</h3>
        <p>{analytics?.total_applications || 0}</p>
      </div>
    </div>
  );
}

export default AdminDashboardStats;

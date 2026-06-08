function DashboardStats({ analytics }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Jobs Posted</h3>
        <p>{analytics?.total_jobs_posted || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Active Listings</h3>
        <p>{analytics?.active_jobs || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Applications Received</h3>
        <p>{analytics?.total_applications_received || 0}</p>
      </div>
    </div>
  );
}

export default DashboardStats;

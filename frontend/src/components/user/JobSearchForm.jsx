function JobSearchForm({ search, handleSearchChange, handleSearchSubmit }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2rem",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Find Opportunities</h2>
      <form
        onSubmit={handleSearchSubmit}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <input
          type="text"
          name="keyword"
          placeholder="Keyword (e.g. Laravel, remote, developer)"
          value={search.keyword}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: "200px" }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Remote, Chicago)"
          value={search.location}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: "150px" }}
        />
        <select
          name="job_type"
          value={search.job_type}
          onChange={handleSearchChange}
          style={{ flex: "0 0 150px" }}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "auto", padding: "0 1.5rem" }}
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default JobSearchForm;

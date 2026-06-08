function JobForm({
  formData,
  loading,
  jobToEdit,
  handleChange,
  handleSubmit,
  onSuccess,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Senior Laravel Engineer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            placeholder="e.g. Acme Corp"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Remote, Chicago, IL"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Compensation / Salary</label>
          <input
            type="text"
            name="salary"
            placeholder="e.g. $80,000 - $100,000"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div className="form-group">
          <label>Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {jobToEdit && (
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active (Visible)</option>
              <option value="inactive">Closed (Hidden)</option>
            </select>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Job Description</label>
        <textarea
          name="description"
          placeholder="Describe the day-to-day responsibilities, stack, and mission..."
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
          style={{ resize: "vertical" }}
        />
      </div>

      <div className="form-group">
        <label>Skills & Requirements</label>
        <textarea
          name="requirements"
          placeholder="e.g. 3+ years experience with PHP, Laravel unit testing..."
          value={formData.requirements}
          onChange={handleChange}
          rows={3}
          style={{ resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {jobToEdit && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onSuccess}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : jobToEdit ? "Update Job Post" : "Post Job Opening"}
        </button>
      </div>
    </form>
  );
}

export default JobForm;

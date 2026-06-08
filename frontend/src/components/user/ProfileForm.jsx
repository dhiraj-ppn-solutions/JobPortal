function ProfileForm({
  profileData,
  profileMessage,
  profileSubmitting,
  handleProfileChange,
  handleProfileSubmit,
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        borderRadius: "16px",
        border: "1px solid var(--border)",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>Profile Details</h2>
      <p className="text-muted">
        Build your candidate profile to attract employers
      </p>

      {profileMessage.text && (
        <div className={`alert alert-${profileMessage.type}`}>
          {profileMessage.text}
        </div>
      )}

      <form onSubmit={handleProfileSubmit}>
        <div className="form-group">
          <label>Key Skills</label>
          <textarea
            name="skills"
            placeholder="e.g. React, Node.js, Python, SQL (comma separated)"
            value={profileData.skills}
            onChange={handleProfileChange}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="form-group">
          <label>Work Experience</label>
          <input
            type="text"
            name="experience"
            placeholder="e.g. 3 years as Backend Engineer"
            value={profileData.experience}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label>Highest Education</label>
          <input
            type="text"
            name="education"
            placeholder="e.g. Bachelor of Computer Science"
            value={profileData.education}
            onChange={handleProfileChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={profileSubmitting}
        >
          {profileSubmitting ? "Saving..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;

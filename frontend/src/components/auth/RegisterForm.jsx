function RegisterForm({
  formData,
  submitting,
  handleChange,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Repeat your password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Profile Type</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="candidate">Candidate (Job Seeker)</option>
          <option value="employer">Employer (Company)</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }} disabled={submitting}>
        {submitting ? "Registering..." : "Register Account"}
      </button>
    </form>
  );
}

export default RegisterForm;

function LoginForm({
  email,
  password,
  submitting,
  handleEmailChange,
  handlePasswordChange,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }} disabled={submitting}>
        {submitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;

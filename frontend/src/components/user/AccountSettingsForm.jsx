function AccountSettingsForm({
  accountData,
  accountMessage,
  accountSubmitting,
  handleAccountChange,
  handleAccountSubmit,
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
      <h2 style={{ marginBottom: "0.5rem" }}>Account Settings</h2>
      <p className="text-muted">Update your general login and contact details</p>

      {accountMessage.text && (
        <div className={`alert alert-${accountMessage.type}`}>
          {accountMessage.text}
        </div>
      )}

      <form onSubmit={handleAccountSubmit}>
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={accountData.name}
            onChange={handleAccountChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={accountData.email}
            onChange={handleAccountChange}
            required
            disabled
          />
          <p className="text-muted" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Email address cannot be changed directly.
          </p>
        </div>

        <div className="form-group">
          <label>New Password (Optional)</label>
          <input
            type="password"
            name="password"
            placeholder="Leave blank to keep current"
            value={accountData.password}
            onChange={handleAccountChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={accountSubmitting}
        >
          {accountSubmitting ? "Saving..." : "Save Account Settings"}
        </button>
      </form>
    </div>
  );
}

export default AccountSettingsForm;

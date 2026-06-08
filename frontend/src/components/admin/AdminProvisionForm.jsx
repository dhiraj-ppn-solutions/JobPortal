import { useState } from "react";

function AdminProvisionForm({ handleCreateAdmin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateAdmin(formData, () => {
      setFormData({ name: "", email: "", password: "" });
    });
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "2.5rem",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2>Add Administrator</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        Create a new administrative login credential
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
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
            placeholder="admin@example.com"
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

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          Provision Admin User
        </button>
      </form>
    </div>
  );
}

export default AdminProvisionForm;

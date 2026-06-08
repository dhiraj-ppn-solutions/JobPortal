function AdminHeader({ title, subtitle }) {
  return (
    <div className="header" style={{ marginBottom: "2rem" }}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

export default AdminHeader;

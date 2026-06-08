import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout({ children, activeTab, setActiveTab, user, handleLogout }) {
  return (
    <div className="dashboard-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
      />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default AdminLayout;

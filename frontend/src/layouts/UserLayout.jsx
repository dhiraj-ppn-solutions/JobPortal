import UserSidebar from "../components/user/UserSidebar";

function UserLayout({
  children,
  activeTab,
  setActiveTab,
  setEditJob,
  user,
  handleLogout,
}) {
  return (
    <div className="dashboard-layout">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setEditJob={setEditJob}
        user={user}
        handleLogout={handleLogout}
      />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default UserLayout;

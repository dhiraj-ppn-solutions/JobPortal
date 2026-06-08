function AuthLayout({ children, style }) {
  return (
    <div className="card-container" style={style}>
      {children}
    </div>
  );
}

export default AuthLayout;

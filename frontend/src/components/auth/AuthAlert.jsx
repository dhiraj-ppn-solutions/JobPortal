function AuthAlert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
}

export default AuthAlert;

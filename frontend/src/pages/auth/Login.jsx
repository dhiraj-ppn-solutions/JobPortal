import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import LoginHeader from "../../components/auth/LoginHeader";
import LoginForm from "../../components/auth/LoginForm";
import AuthAlert from "../../components/auth/AuthAlert";
import AuthLayout from "../../layouts/AuthLayout";

function Login() {
  const {
    email,
    password,
    error,
    success,
    submitting,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLogin();

  return (
    <AuthLayout>
      <LoginHeader />

      <AuthAlert type="danger" message={error} />
      <AuthAlert type="success" message={success} />

      <LoginForm
        email={email}
        password={password}
        submitting={submitting}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        handleSubmit={handleSubmit}
      />

      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
        }}
      >
        Don't have an account? <Link to="/register">Create an account</Link>
      </div>
    </AuthLayout>
  );
}

export default Login;
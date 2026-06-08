import { Link } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import RegisterHeader from "../../components/auth/RegisterHeader";
import RegisterForm from "../../components/auth/RegisterForm";
import AuthAlert from "../../components/auth/AuthAlert";
import AuthLayout from "../../layouts/AuthLayout";

function Register() {
  const {
    formData,
    error,
    success,
    submitting,
    handleChange,
    handleSubmit,
  } = useRegister();

  return (
    <AuthLayout style={{ margin: "4rem auto" }}>
      <RegisterHeader />

      <AuthAlert type="danger" message={error} />
      <AuthAlert type="success" message={success} />

      <RegisterForm
        formData={formData}
        submitting={submitting}
        handleChange={handleChange}
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
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
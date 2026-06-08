import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { login: saveAuth } = useAuth();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await apiLogin({ email, password });
      if (response.data && response.data.success) {
        setSuccess("Login successful!");
        saveAuth(response.data.token, response.data.user);
        
        // Redirect based on role
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    password,
    error,
    success,
    submitting,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

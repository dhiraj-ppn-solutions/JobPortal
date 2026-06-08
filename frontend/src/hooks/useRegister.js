import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/authService";

export const useRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "candidate",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await apiRegister(formData);
      if (response.data && response.data.success) {
        setSuccess("Registration successful! Redirecting to login page...");
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "candidate",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(" ");
        setError(validationErrors);
      } else {
        setError("Something went wrong during registration.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    error,
    success,
    submitting,
    handleChange,
    handleSubmit,
  };
};

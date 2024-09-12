import React, { useState } from "react";
import { signup } from "../../api/authApi";
import { toast } from "react-toastify";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Enter same Password in both fields";
    }

    return newErrors;
  };
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await signup({
        username,
        email,
        password,
        confirmPassword,
      });
      if (response.status === 200) {
        const loginResponse = await login({ email, password });

        if (loginResponse.status === 200) {
          localStorage.setItem("user", loginResponse.data.user._id);
          localStorage.setItem("token", loginResponse.data.token);
          toast.success("Logged In successfully!");
          navigate(`/dashboard/${response.data.user._id}`);
        } else {
          toast.error(loginResponse.message);
        }
      } else {
        toast.error(response.error || "Registration failed");
      }
      console.log(response);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            height: "70px",
          }}
        >
          <label style={{ fontWeight: "bolder" }}>Name</label>
          <div>
            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid ${errors.username ? "red" : "#808080"}`,
                outline: "none",
                background: "none",
                width: "300px",
              }}
              type="text"
              placeholder="Enter a name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
            />
            {errors.username && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.username}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "70px",

            gap: "15px",
          }}
        >
          <label style={{ fontWeight: "bolder" }}>Email</label>
          <div>
            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid ${errors.email ? "red" : "#808080"}`,
                outline: "none",
                background: "none",
                width: "300px",
              }}
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "70px",

            gap: "15px",
          }}
        >
          <label style={{ fontWeight: "bolder" }}>Password</label>
          <div>
            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid ${errors.password ? "red" : "#808080"}`,
                outline: "none",
                background: "none",
                width: "300px",
              }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.password}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "70px",

            gap: "15px",
          }}
        >
          <label style={{ fontWeight: "bolder" }}>Confirm Password</label>
          <div>
            <input
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: `1px solid ${
                  errors.confirmPassword ? "red" : "#808080"
                }`,
                outline: "none",
                background: "none",
                width: "300px",
              }}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {errors.confirmPassword && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        style={{
          background: "#A9BCFF",
          boxShadow: "none",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          width: "300px",
          cursor: "pointer",
          fontWeight: "bolder",
          margin: "10px 0",
        }}
        onClick={handleSubmit}
      >
        Sign up
      </button>
    </div>
  );
}

export default SignUp;

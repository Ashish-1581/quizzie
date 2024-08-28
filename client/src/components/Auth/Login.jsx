import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { toast } from "react-toastify";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login({ email, password });
      if (response.status === 200) {
        localStorage.setItem("user", response.data.user.username);
        localStorage.setItem("token", response.data.token);
        toast.success("Logged In successfully!");

        navigate(`/dashboard/${response.data.user._id}`);
      } else {
        toast.error(response.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            height:"70px",

            gap: "15px",
          }}
        >
          <label style={{  fontWeight: "bolder",}}>Email</label>
          <div >
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
            height:"70px",

            gap: "15px",
          }}
        >
          <label style={{  fontWeight: "bolder",}}>Password</label>
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
                  Login
                </button>
    </div>
  );
}

export default Login;

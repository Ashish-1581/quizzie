import React, { useState } from 'react'
import { signup } from '../../api/authApi';
import { toast } from 'react-toastify';
import { login } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

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
              localStorage.setItem("user", loginResponse.data.user.username);
              localStorage.setItem("token", loginResponse.data.token);
              toast.success("Logged In successfully!");
              navigate(`/dashboard/${response.data.user._id}`);
            }
            else{
              toast.error(loginResponse.message);
              
            }
          }
          else {
            toast.error(response.message || "Registration failed");
          }
          console.log(response);
         
          
        } catch (error) {
          toast.error("An error occurred. Please try again.");
          console.log(error);
        }
      };
  return (
    <div style={{background:"black"}}>
    <h2>Sign Up</h2>
    <div >
    <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            gap: "15px",
          }}
        >
          <label>Username</label>
          <input
            style={{
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: `1px solid ${errors.username ? "red" : "#808080"}`,
              outline: "none",
              background: "none",
              width: "300px",
            }}
            type="text"
            placeholder="Enter a Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />
          {errors.username && (
            <span style={{ color: "red" }}>{errors.username}</span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            gap: "15px",
          }}
        >
          <label>Email</label>
          <input
            style={{
              color: "white",
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
            <span style={{ color: "red" }}>{errors.email}</span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            gap: "15px",
          }}
        >
          <label>Password</label>
          <input
            style={{
              color: "white",
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
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            gap: "15px",
          }}
        >
          <label>Confirm Password</label>
          <input
            style={{
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: `1px solid ${errors.confirmPassword ? "red" : "#808080"}`,
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
            <span style={{ color: "red" }}>{errors.confirmPassword}</span>
          )}
        </div>

        <button
          style={{
            background: "#1A5FFF",
            color: "white",
            boxShadow: "none",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            width: "300px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Sign up
        </button>
    </div>

  </div>
  )
}

export default SignUp


// <form>
// <input
//   value={userName}
//   onChange={(e) => setUserName(e.target.value)}
//   type="text"
//   placeholder="Username"
// />
// <input type="email" placeholder="Email" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
// <input type="password" placeholder="Password" value={password}  onChange={(e)=>setpassword(e.target.value)} />
// <input type="password" placeholder="confirm Password" value={confirmPassword}  onChange={(e)=>setConfirmPassword(e.target.value)} />
// <button type="submit" onClick={handleSubmit}>Sign Up</button>

// </form>
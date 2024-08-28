import React, { act, useState } from "react";

import SignUp from "../components/Auth/SignUp";
import Login from "../components/Auth/Login";

function Auth() {
  const [toggle, setToggle] = useState(true);



  return (
    <>
      <div
        style={{
          background: "#F2F2F2",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "20px",
            height: "500px",
            width: "800px",
            boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "3.5rem" }}>QUIZZIE</h1>
            <div style={{ display: "flex", gap: "50px", margin: "20px" }}>
              <button
                style={{
                  padding: "5px 50px",
                  background: "#F2F2F2",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                  margin: "0 5px",
                  boxShadow: `${toggle?"0px 0px 20px 0px #A9BCFF":"none"}`,
                }}
                onClick={() => setToggle(true)}
              >
                Sign Up
              </button>
              <button
                style={{
                  padding: "5px 50px",
                  background: "#F2F2F2",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                  margin: "0 5px",
                  boxShadow: `${!toggle?"0px 0px 20px 0px #A9BCFF":"none"}`,
                }}
                onClick={() => setToggle(false)}
              >
                Login
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {toggle ? <SignUp /> : <Login />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;

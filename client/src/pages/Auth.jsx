import React, { useState } from "react";

import SignUp from '../components/Auth/SignUp';
import Login from '../components/Auth/Login';

function Auth() {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <h1>QUIZZIE</h1>

      <button onClick={() => setToggle(true)}>Sign Up</button>
      <button onClick={() => setToggle(false)}>Login</button>

      {toggle ? (<SignUp />
       
      ) : (
        <Login/>
        
      )}
    </>
  );
}

export default Auth;

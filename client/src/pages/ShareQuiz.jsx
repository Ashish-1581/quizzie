import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";


function ShareQuiz() {
  const { quizId } = useParams();
  const { userId } = useParams();
  const navigate = useNavigate();

  let path = `${window.location.origin}/quiz/${quizId}`;
  const handelShare = () => {
    navigator.clipboard
      .writeText(path)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };
  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "50px",
            height: "300px",
            width: "600px",
            borderRadius: "10px",
            position: "relative",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent:"center",
            
          }}
        ><button onClick={()=>navigate(`/dashboard/${userId}`)} className="button-x" style={{right:"20px",fontSize:"2.7rem"}}>x</button>
          <h2 style={{fontSize:"3rem"}}>Congrats your Quiz is Published!</h2>
          <input  className="question-input" value={path} disabled type="text" />
          <button className="button" style={{background:"#60B84B",color:"white"}} onClick={handelShare}>Share</button>
        </div>
      </div>
    </>
  );
}

export default ShareQuiz;

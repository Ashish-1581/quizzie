import React, { useState } from "react";
import { create_Quiz } from "../api/quizApi";
import { useNavigate } from "react-router-dom";
import CreateQnA from "../components/createQuiz/CreateQnA";
import CreatePoll from "../components/createQuiz/CreatePoll";
import "../styles/CreateQuiz.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function CreateQuiz() {
  const [quizType, setQuizType] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState("");
  const [isPoll, setIsPoll] = useState(false);
  const [isQna, setIsQna] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = useParams().userId;

  const handleCreate = async () => {
  
    if (quizTitle.trim() === "" || quizType === "") {
      toast.error("Please provide both a quiz name and a quiz type.");
   
      return;
    }

    const quiz = {
      title: quizTitle,
      type: quizType,
    };
    const response = await create_Quiz(quiz, token);
    if (response.status === 201) {
      console.log("Quiz created successfully!");

      setQuizId(response.data._id);
      if (quizType === "poll") {
        setIsPoll(true);
      } else if (quizType === "qna") {
        setIsQna(true);
      }
    }
  };

  const handleQuizTypeChange = (event) => {
    setQuizType(event.target.value);
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
        {!isPoll && !isQna ? (
          <div
            style={{
              background: "white",
              padding: "50px",
              width: "500px",
              height: "200px",
              borderRadius: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Quiz name"
              onChange={(e) => setQuizTitle(e.target.value)}
              style={{
                margin: "10px 0",
                padding: "10px",
                width: "100%",
                outline: "none",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                border: "none",
                borderRadius: "5px",
                color: "black",
                fontSize: "1.2rem",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between",alignItems:'center' }}>
              <h3 style={{color:"#9F9F9F",fontSize: "1.5rem"}}>Quiz type</h3>
              <label
                className={`radio-button ${quizType === "qna" ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="quizType"
                  value="qna"
                  onChange={handleQuizTypeChange}
                />{" "}
                Q & A
              </label>
              <label
                className={`radio-button ${
                  quizType === "poll" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="quizType"
                  value="poll"
                  onChange={handleQuizTypeChange}
                />{" "}
                Poll Type
              </label>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button className="button" onClick={() => navigate(`/dashboard/${userId}`)}>Cancel</button>
              <button className="button" style={{color:"white",background:"#60B84B"}} onClick={handleCreate}>Continue</button>
           
            </div>
            
          </div>
        ) : (
          <div>
            {isPoll && <CreatePoll quizId={quizId} />}
            {isQna && <CreateQnA quizId={quizId} />}
          </div>
        )}
      </div>
    </>
  );
}

export default CreateQuiz;

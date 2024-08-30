import React from "react";
import { get_ResponseById } from "../../api/responseApi";
import { get_QuizById } from "../../api/quizApi";
import { Audio } from 'react-loader-spinner'
import { useState, useEffect } from "react";
import { get_PollById } from "../../api/pollApi";

function PollResponse({ quizId }) {
  const [response, setResponse] = useState(null);
  const [poll, setPoll] = useState(null);
  const [quiz, setQuiz] = useState(null);
  useEffect(() => {
    fetchResponse();
    fetchPoll();
    fetchQuiz(quizId);
  }, [quizId]);
  const fetchResponse = async () => {
    const res = await get_ResponseById(quizId);
    if (res.status === 200) {
      setResponse(res.data);
    }
  };

  const fetchPoll = async () => {
    const res = await get_PollById(quizId);
    if (res.data) {
      setPoll(res.data.pollArray);
      console.log(res.data.pollArray);
    }
  };

  const fetchQuiz = async (quizId) => {
    const res = await get_QuizById(quizId);
    if (res.data) {
      setQuiz(res.data);
    }
  };

  if (!response || !poll || !quiz) {
    return  <div style={{display:"flex",justifyContent:"center"}}> <Audio
    height="80"
    width="80"
    radius="9"
    color="green"
    ariaLabel="loading"
    wrapperStyle
    wrapperClass
  />;
  </div>
  }

  const resultCounts = poll.map((item) => ({
    question: item.question,
    counts: item.inputs.map((_, index) => ({
      option: `Option ${index + 1}`,
      count: response.reduce((count, res) => {
        const matchingAnswers = res.responseData.filter(
          (responseItem) =>
            responseItem.name === item.name && responseItem.answer === index
        );
        return count + matchingAnswers.length;
      }, 0),
    })),
  }));

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#5076FF", fontSize: "2.5rem" }}>
            {quiz.title} Questions Analysis
          </h2>
          <div
            style={{ color: "#FF5D01", fontWeight: "bolder", fontSize: "1rem" }}
          >
            <p>Created on : {quiz.createdAt}</p>
            <p>Impressions : {quiz.impression}</p>
          </div>
        </div>

        <div >

        {resultCounts.map((result, index) => (
          <div style={{borderBottom:"1px solid #37373e",margin:"10px 0"}}key={index}>
            <h3 style={{fontSize:"2rem"}}>Q.{index+1} {result.question}?</h3>
            <div style={{ display: "flex", gap: "40px", margin: "30px 0" }}>
              {result.counts.map((count, countIndex) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  
                    gap: "10px",
                    
                    padding: "10px 10px",
                    borderRadius: "5px",
                    backgroundColor: "#FFFFFF",
                    height: "50px",
                    width: "170px",
                    
                  }}
                  key={countIndex}
                >
                  <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                  
                    {count.count}
                  </div>
                  <div style={{ fontWeight: "bolder" }}> {count.option} </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

export default PollResponse;

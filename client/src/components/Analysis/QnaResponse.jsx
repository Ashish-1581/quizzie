import React from "react";
import { get_ResponseById } from "../../api/responseApi";
import { get_QnaById } from "../../api/qnaApi";
import { get_QuizById } from "../../api/quizApi";
import { useState, useEffect } from "react";
import styles from "./QnaResponse.module.css";
import { Audio } from 'react-loader-spinner'

function QnaResponse({ quizId }) {
  const [response, setResponse] = useState(null);
  const [qna, setQna] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetchResponse();
    fetchQna();
    fetchQuiz(quizId);
  }, [quizId]);
  const fetchResponse = async () => {
    const res = await get_ResponseById(quizId);
    if (res.status === 200) {
      setResponse(res.data);
    }
  };

  const fetchQna = async () => {
    const res = await get_QnaById(quizId);
    if (res.data) {
      setQna(res.data.qnaArray);
    }
  };
  const fetchQuiz = async (quizId) => {
    const res = await get_QuizById(quizId);
    if (res.data) {
      setQuiz(res.data);
    }
  };

  if (!response || !qna || !quiz) {
    return <div style={{display:"flex",justifyContent:"center"}}> <Audio
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

  const results = qna.map((item) => {
    let correctCount = 0;
    let incorrectCount = 0;

    response.forEach((res) => {
      res.responseData.forEach((data) => {
        if (data.name === item.name) {
          if (data.answer === 1) {
            correctCount++;
          } else if (data.answer === 0) {
            incorrectCount++;
          }
        }
      });
    });
    const totalAttempts = correctCount + incorrectCount;

    return {
      question: item.question,
      correctCount,
      incorrectCount,
      totalAttempts,
    };
  });

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
        <div style={{  margin: "30px 0" }}>
          {results.map((result, index) => (
            <div key={index}>
              <h3 style={{fontSize:"2rem"}}>Q.{index+1} {result.question}?</h3>
              <div className={styles.container}>
                <div className={styles.card}>
                  <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                    {result.totalAttempts}
                  </div>
                  <div style={{ fontWeight: "bolder" }}>
                    people Attempted the question
                  </div>{" "}
                </div>
                <div className={styles.card}>
                  <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                    {result.correctCount}
                  </div>{" "}
                  <div style={{ fontWeight: "bolder" }}>
                    people Answered Correctly
                  </div>
                </div>
                <div className={styles.card}>
                  <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                    {result.incorrectCount}{" "}
                  </div>{" "}
                  <div style={{ fontWeight: "bolder" }}>people Answered
                  Incorrectly</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default QnaResponse;

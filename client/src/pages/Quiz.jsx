import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { get_PollById } from "../api/pollApi";
import { get_QnaById } from "../api/qnaApi";
import { create_Response } from "../api/responseApi";
import { get_QuizById, update_Quiz } from "../api/quizApi";
import PollSubmitted from "../components/Quiz/PollSubmitted";
import QnaSubmitted from "../components/Quiz/QnaSubmitted";
import styles from "./Quiz.module.css";

function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const [items, setItems] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickedIndex, serClickedIndex] = useState(null);

  const [pollData, setPollData] = useState([]);
  const [qnaData, setQnaData] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [pollSubmit, setPollSubmit] = useState(false);
  const [qnaSubmit, setQnaSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchAndUpdateViews = async () => {
      try {
        const currentViews = await get_QuizById(quizId);
        console.log(currentViews);

        if(currentViews.data._id == quizId){ {

        const newViews = currentViews.data.impression + 1;

        const response = await update_Quiz({ quizId, impression: newViews });
        }}
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    fetchAndUpdateViews();
  }, []);

  const fetchQuiz = async () => {
    const response = await get_QuizById(quizId);

    if (response.status === 200) {
      setQuiz(response.data);

      if (response.data.type === "poll") {
        const responsePoll = await get_PollById(quizId);
        if (responsePoll.status === 200) {
          setItems(responsePoll.data.pollArray);
        }
      } else if (response.data.type === "qna") {
        const responseQna = await get_QnaById(quizId);
        if (responseQna.status === 200) {
          setItems(responseQna.data.qnaArray);
        }
      }
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItem(items[selectedItemIndex]);
    }
  }, [items, selectedItemIndex]);

  useEffect(() => {
    if (selectedItem && selectedItem.timer !== "off") {
      setTimeLeft(parseInt(selectedItem.timer, 10));
    } else {
      setTimeLeft(null);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }

    if (timeLeft === 0) {
      handelNext();

      if (selectedItemIndex === items.length - 1) {
        handelSubmit();

        setTimeLeft(null);

        return;
      }
    }
  }, [timeLeft]);

  const handelNext = () => {
    if (selectedItemIndex < items.length - 1) {
      setSelectedItemIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handelClick = (index) => {
    serClickedIndex(index);
    if (quiz.type === "poll") {
      setPollData((prev) => [
        ...prev,
        { name: items[selectedItemIndex].name, answer: index },
      ]);
    } else if (quiz.type === "qna") {
      if (index === items[selectedItemIndex].answerIndex) {
        setCorrect((prev) => prev + 1);
        console.log("correct");
        setQnaData((prev) => [
          ...prev,
          { name: items[selectedItemIndex].name, answer: 1 },
        ]);
      } else {
        console.log("incorrect");
        setQnaData((prev) => [
          ...prev,
          { name: items[selectedItemIndex].name, answer: 0 },
        ]);
      }
    }
  };

  const handelSubmit = async () => {
    if (quiz.type === "poll") {
      if (pollData.length !== 0) {
        const res = await create_Response(quizId, pollData);
        if (res.status === 200) {
          console.log("Poll Submitted");
          setTimeLeft(null);
        }
      }

      setPollSubmit(true);
    } else if (quiz.type === "qna") {
      if (qnaData.length !== 0) {
        const res = await create_Response(quizId, qnaData);
        if (res.status === 200) {
          console.log("Qna Submitted");
          setTimeLeft(null);
        }
      }
      setQnaSubmit(true);
    }
  };

  return (
    <>
      <div
        style={{
          background: "#041325",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "30px",
            height: "75%",
            width: "80%",
            boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.3)",
            textAlign: "center",
            overflow: "auto",
          }}
        >
          {!pollSubmit && !qnaSubmit && selectedItem && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>
                  0{selectedItemIndex + 1}/0{items.length}
                </h2>
                {timeLeft !== null && (
                  <h2 style={{ color: "red" }}>00:{timeLeft}s</h2>
                )}
              </div>
              <div >
              <h1 >{selectedItem.question}</h1>
              </div>
              <div className={styles.options}>
                {selectedItem.inputs.map((input, index) => (
                  <div className={styles.option} key={index}>
                    {selectedItem.type === "text" && (
                      <div
                        style={{
                          borderRadius:"10px",
                          border: `${
                            clickedIndex == index ? "2px solid blue" : "none"
                          }`,
                          fontWeight: "bold",
                          fontSize: "20px",
                          height:"100%",
                          width:"100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => handelClick(index)}
                      >
                        {input.text}
                      </div>
                    )}

                    {selectedItem.type === "imageUrl" && (
                      <div
                        style={{
                          borderRadius:"10px",
                          border: `${
                            clickedIndex == index ? "2px solid blue" : "none"
                          }`,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height:"100%",
                          width:"100%"
                        }}
                        onClick={() => handelClick(index)}
                      >
                        <img
                          src={input.imageUrl}
                          alt={`Input ${index + 1}`}
                          style={{ width: "60%", height: "100%" }}
                        />
                      </div>
                    )}

                    {selectedItem.type === "both" && (
                      <div
                        style={{
                          borderRadius:"10px",
                          border: `${
                            clickedIndex == index ? "2px solid blue" : "none"
                          }`,
                          display: "flex",
                      
                          justifyContent: "space-between",
                          alignItems: "center",
                          width:"100%",
                          height:"100%",
                          padding:"10px",
                          textAlign:"center"
                        }}
                        onClick={() => handelClick(index)}
                      >
                        <p style={{width:"40%"}}>{input.text}</p>
                        <img
                          src={input.imageUrl}
                          alt={`Input ${index + 1}`}
                          style={{ width: "60%", height: "100%" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedItemIndex < items.length - 1 ? (
                <button className={styles.button} onClick={() => handelNext()}>
                  Next
                </button>
              ) : (
                <button
                  className={styles.button}
                  onClick={() => handelSubmit()}
                >
                  Submit
                </button>
              )}
            </div>
          )}
          {pollSubmit && <PollSubmitted />}
          {qnaSubmit && <QnaSubmitted correct={correct} total={items.length} />}
        </div>
      </div>
    </>
  );
}

export default Quiz;

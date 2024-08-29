import React, { useEffect, useState } from "react";
import Display from "../components/Dashboard/Display";
import Analysis from "../components/Dashboard/Analysis";
import { get_Quizzes } from "../api/quizApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { get_Polls } from "../api/pollApi";
import { get_Qnas } from "../api/qnaApi";

import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [countImpression, setCountImpression] = useState(0);
  const token = localStorage.getItem("token");
  const userId = useParams().userId;
  const [qnas, setQnas] = useState(0);
  const [polls, setPolls] = useState(0);
  const [isAnalytics, setIsAnalytics] = useState(false);

  const fetchQuizzes = async () => {
    const response = await get_Quizzes(token);

    if (response.data) {
      setQuizzes(response.data);
    }
  };
  useEffect(() => {
    fetchQuizzes();
    fetchPolls();
    fetchQnas();
  }, []);
  const fetchQnas = async () => {
    const res = await get_Qnas(userId);
    if (res.data) {
      res.data.map((qna) => {
        setQnas((prev) => prev + qna.qnaArray.length);
      });
    }
  };

  const fetchPolls = async () => {
    const res = await get_Polls(userId);
    if (res.data) {
      res.data.map((poll) => {
        setPolls((prev) => prev + poll.pollArray.length);
      });
    }
  };
  const totalQuestions = qnas + polls;

  const calcImpression = () => {
    let count = 0;
    quizzes.map((quiz) => {
      count += quiz.impression;
    });

    setCountImpression(count);
  };
  useEffect(() => {
    calcImpression();
  }, [quizzes]);

  const handelLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ fontSize: "3rem" }}>QUIZZIE</h1>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              className={styles.button}
              style={{
                boxShadow: `${
                  !isAnalytics ? "0 0 10px 0 rgba(0, 0, 0, 0.2)" : "none"
                }`,
              }}
              onClick={() => setIsAnalytics(false)}
            >
              Dashboard
            </button>
            <button
              className={styles.button}
              onClick={() => setIsAnalytics(true)}
              style={{
                boxShadow: `${
                  isAnalytics ? "0 0 10px 0 rgba(0, 0, 0, 0.2)" : "none"
                }`,
              }}
            >
              Analytics
            </button>
            <button
              className={styles.button}
              onClick={() => navigate("/create_quiz")}
            >
              Create Quiz
            </button>
          </div>

          <h2 style={{ cursor: "pointer",borderTop:"2px solid #37373e"}} onClick={handelLogout}>
            LOGOUT
          </h2>
        </div>

        <div
          style={{
            background: "#EDEDED",
            width: "100vw",
            padding: "50px",
            overflow: "auto",
          }}
        >
          {!isAnalytics ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    color: "#FF5D01",
                    fontSize: "1.5rem",
                    fontWeight: "bolder",
                  }}
                  className={styles.stats}
                >
                  <span style={{ fontSize: "3.5rem" }}>{quizzes.length}</span>{" "}
                  Quiz Created
                </div>
                <div
                  style={{
                    color: "#60B84B",
                    fontSize: "1.5rem",
                    fontWeight: "bolder",
                  }}
                  className={styles.stats}
                >
                  <span style={{ fontSize: "3.5rem" }}>{totalQuestions}</span>
                  Questions Created
                </div>
                {countImpression <= 1000 ? (
                  <div
                    style={{
                      color: "#5076FF",
                      fontSize: "1.5rem",
                      fontWeight: "bolder",
                    }}
                    className={styles.stats}
                  >
                    <span style={{ fontSize: "3.5rem" }}>
                      {countImpression}
                    </span>
                    Total Impressions
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#5076FF",
                      fontSize: "1.5rem",
                      fontWeight: "bolder",
                    }}
                    className={styles.stats}
                  >
                    <span style={{ fontSize: "3.5rem" }}>
                      {(countImpression / 1000).toFixed(1)}K
                    </span>{" "}
                    Total Impressions
                  </div>
                )}
              </div>
              <Display />
            </div>
          ) : (
            <Analysis />
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;

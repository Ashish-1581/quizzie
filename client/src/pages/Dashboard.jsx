import React, { useEffect, useState } from "react";
import Display from "../components/Dashboard/Display";
import Analysis from "../components/Dashboard/Analysis";
import { get_Quizzes } from "../api/quizApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { get_Polls } from "../api/pollApi";
import { get_Qnas } from "../api/qnaApi";

function Dashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [countImpression, setCountImpression] = useState(0);
  const token = localStorage.getItem("token");
  const userId = useParams().userId;
  const [qnas, setQnas] = useState(0);
  const [polls, setPolls] = useState(0);

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
  }, [userId]);
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

  return (
    <>
      <div>
        Dashboard
        <div>
          <div>total quiz:{quizzes.length}</div>
          <div>total questions:{totalQuestions}</div>
          {countImpression <= 1000 ? (
            <div>total impression:{countImpression}</div>
          ) : (
            <div>{(countImpression / 1000).toFixed(1)}K</div>
          )}

          <button onClick={() => navigate("/create_quiz")}>create Quiz</button>
        </div>
        <Display />
        <Analysis userId={userId} />
      </div>
    </>
  );
}

export default Dashboard;

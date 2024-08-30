import React, { useEffect, useState } from "react";
import { get_Quizzes, delete_Quiz } from "../../api/quizApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QnaResponse from "../Analysis/QnaResponse";
import PollResponse from "../Analysis/PollResponse";
import "./Analysis.css";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import DeleteQuizModel from "./DeleteQuizModel";

function Analysis() {
  const [quizzes, setQuizzes] = useState([]);
  const [isPoll, setIsPoll] = useState(false);
  const [isQna, setIsQna] = useState(false);
  const [quizId, setQuizId] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const OpenModel = () => {
    setIsModalOpen(true);
  };

  const CloseModel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);
  const fetchQuizzes = async () => {
    const response = await get_Quizzes(token);
    if (response.data) {
      setQuizzes(response.data);
    }
  };

  const handelDelete = async (quizId) => {
    const response = await delete_Quiz(quizId);
    if (response.status === 200) {
      fetchQuizzes();
      CloseModel();
    }
  };
  const handelShare = (quizId) => {
    let path = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard
      .writeText(path)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  const handelEdit = (quizId, type) => {
    if (type === "poll") {
      navigate(`/edit_poll/${userId}/${quizId}`);
    } else {
      navigate(`/edit_qna/${userId}/${quizId}`);
    }
  };

  const questionWiseAnalysis = (quizId, type) => {
    if (type === "poll") {
      setQuizId(quizId);
      setIsPoll(true);
    } else {
      setQuizId(quizId);
      setIsQna(true);
    }
  };

  return (
    <>
      {!quizzes.length && !isPoll && !isQna && <div style={{textAlign:"center"}}><h1>No quizzes found</h1></div>}

      {quizzes.length > 0 && !isPoll && !isQna && (
        <div>
          <table className="quiz-table">
            <thead>
              <tr>
                <th>S.No</th> {/* Index column header */}
                <th>Quiz Name</th>
                <th>Created On</th>
                <th>Impression</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                  key={index}
                >
                  <td>{index + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{quiz.createdAt}</td>
                  <td>{quiz.impression}</td>
                  <td>
                    <button
                      className="action"
                      onClick={() => handelEdit(quiz._id, quiz.type)}
                    >
                      <FaRegEdit style={{ color: "#854CFF" }} />
                    </button>
                    <button className="action" onClick={OpenModel}>
                      <RiDeleteBin6Fill style={{ color: "#D60000" }}/>
                    </button>
                    <DeleteQuizModel
                      isOpen={isModalOpen}
                      onClose={CloseModel}
                      onDelete={() => handelDelete(quiz._id)}
                    />
                    <button
                      className="action"
                      onClick={() => handelShare(quiz._id)}
                    >
                      <IoMdShare style={{ color: "#60B84B" }} />
                    </button>
                  </td>
                  <td>
                    <Link
                      style={{ color: "black" }}
                      onClick={() => questionWiseAnalysis(quiz._id, quiz.type)}
                    >
                      Question Wise Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPoll && <PollResponse quizId={quizId} />}
      {isQna && <QnaResponse quizId={quizId} />}
    </>
  );
}

export default Analysis;

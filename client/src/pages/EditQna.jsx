import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_QnaById } from "../api/qnaApi";
import { update_Qna } from "../api/qnaApi";
import { useNavigate } from "react-router-dom";
import { Audio } from 'react-loader-spinner'
import { toast } from 'react-toastify';

function EditQna() {
  const { quizId } = useParams();
  const [items, setItems] = useState(null);
  const navigate = useNavigate();
  const {userId}=useParams();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);
  const fetchQuiz = async () => {
    const response = await get_QnaById(quizId);
    if (response.data) {
      setItems(response.data.qnaArray);
    }
  };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [validationMessages, setValidationMessages] = useState({
    question: "",
    input: "",
    answer: "",
  });

  const handleInputChange = (index, inputIndex, field, value) => {
    const newItems = [...items];
    newItems[index].inputs[inputIndex][field] = value;
    setItems(newItems);
  };

  const handleQuestionChange = (index, value) => {
    const newItems = [...items];
    newItems[index].question = value;
    setItems(newItems);
  };
  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleTimerChange = (index, timerValue) => {
    const newItems = [...items];
    newItems[index].timer = timerValue;
    setItems(newItems);
  };
  const updateQna = async () => {
    const newValidationMessages = {
      question: "",
      input: "",
      answer: "",
    };

    const allQuestionsFilled = items.every(
      (item) => item.question.trim() !== ""
    );
    const allInputsFilled = items.every((item) =>
      item.inputs.every((input) =>
        item.type === "both"
          ? input.text.trim() !== "" && input.imageUrl.trim() !== ""
          : input.text.trim() !== "" || input.imageUrl.trim() !== ""
      )
    );
    const allAnswersSelected = items.every((item) => item.answerIndex !== null);

    if (!allQuestionsFilled) {
      newValidationMessages.question =
        "Please fill in the question for every item.";
    }

    if (!allInputsFilled) {
      newValidationMessages.input =
        "Please fill in all input fields for every item.";
    }

    if (!allAnswersSelected) {
      newValidationMessages.answer = "Please select an answer for each item.";
    }

    setValidationMessages(newValidationMessages);

    // Simulate toast notifications
    if (allQuestionsFilled && allInputsFilled && allAnswersSelected) {
      console.log(items);

      const response = await update_Qna(items, quizId);

      if (response.status === 201) {
        toast.success("Quiz updated successfully!");
        
        navigate(`/share_quiz/${userId}/${quizId}`);
      }
    } else {
      // Show individual validation messages
      if (newValidationMessages.question) {
        toast.error(newValidationMessages.question);

      }
      if (newValidationMessages.input) {
        toast.error(newValidationMessages.input);
      
      }
      if (newValidationMessages.answer) {
        toast.error(newValidationMessages.answer);
       
      }
    }
  };

  if (!items) {
    return <div style={{display:"flex",justifyContent:"center"}}> <Audio
    height="80"
    width="80"
    radius="9"
    color="green"
    ariaLabel="loading"
    wrapperStyle
    wrapperClass
  />
  </div>
  }

  const selectedItem = items[selectedItemIndex];
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
            height: "500px",
            width: "600px",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          {items && (
            <div>
              <div className="items-container">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <div className="items-list">
                    {items.map((item, index) => (
                      <div key={index}>
                        <button
                          onClick={() => handleItemClick(index)}
                          className={`item-button ${
                            index === selectedItemIndex ? "selected" : ""
                          }`}
                        >
                          {index + 1}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedItem && (
                <div>
                  <div>
                    <input
                      type="text"
                      value={selectedItem.question}
                      onChange={(e) =>
                        handleQuestionChange(selectedItemIndex, e.target.value)
                      }
                      placeholder="Q & A question"
                      className="question-input"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {selectedItem.inputs.map((input, inputIndex) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        key={inputIndex}
                      >
                      <label>
                      <input
                        type="radio"
                        name={`answer-${selectedItemIndex}`}
                        checked={selectedItem.answerIndex === inputIndex}
                        onChange={() =>
                          handleAnswerSelect(selectedItemIndex, inputIndex)
                        }
                      />
                    </label>
                        {selectedItem.type === "text" && (
                          <input
                            type="text"
                            value={input.text}
                            onChange={(e) =>
                              handleInputChange(
                                selectedItemIndex,
                                inputIndex,
                                "text",
                                e.target.value
                              )
                            }
                            placeholder={`Text `}
                            className={`option-input ${
                              selectedItem.answerIndex === inputIndex
                                ? "correct"
                                : ""
                            } `}
                          />
                        )}

                        {selectedItem.type === "imageUrl" && (
                          <input
                            type="text"
                            value={input.imageUrl}
                            onChange={(e) =>
                              handleInputChange(
                                selectedItemIndex,
                                inputIndex,
                                "imageUrl",
                                e.target.value
                              )
                            }
                            placeholder={`Image URL `}
                            className={`option-input ${
                              selectedItem.answerIndex === inputIndex
                                ? "correct"
                                : ""
                            } `}
                          />
                        )}

                        {selectedItem.type === "both" && (
                          <div  style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}>
                            <input
                              type="text"
                              value={input.text}
                              onChange={(e) =>
                                handleInputChange(
                                  selectedItemIndex,
                                  inputIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder={`Text `}
                              className={`option-input ${
                                selectedItem.answerIndex === inputIndex
                                  ? "correct"
                                  : ""
                              } `}
                            />
                            <input
                              type="text"
                              value={input.imageUrl}
                              onChange={(e) =>
                                handleInputChange(
                                  selectedItemIndex,
                                  inputIndex,
                                  "imageUrl",
                                  e.target.value
                                )
                              }
                              placeholder={`Image URL `}
                              className={`option-input ${
                                selectedItem.answerIndex === inputIndex
                                  ? "correct"
                                  : ""
                              } `}
                            />
                          </div>
                        )}

                      
                      </div>
                    ))}
                  </div>

                  {/* Timer Options */}

                  <div className="timer">
                    <h4>Timer</h4>
                    <div className="timer-options">
                      <button
                        className={`timer-button ${
                          selectedItem.timer === "off" ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimerChange(selectedItemIndex, "off")
                        }
                      >
                        Off
                      </button>
                      <button
                        className={`timer-button ${
                          selectedItem.timer === "5" ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimerChange(selectedItemIndex, "5")
                        }
                      >
                        5 seconds
                      </button>
                      <button
                        className={`timer-button ${
                          selectedItem.timer === "10" ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimerChange(selectedItemIndex, "10")
                        }
                      >
                        10 seconds
                      </button>
                    </div>
                  </div>
                </div>
              )}

         

              <div className="lower-button">
              <button
                className="button"
                onClick={() => navigate(`/dashboard/${userId}`)}
              >
                Cancel
              </button>
              <button
                className="button"
                style={{ color: "white", background: "#60B84B" }}
                onClick={updateQna}
              >
                Update Quiz
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditQna;

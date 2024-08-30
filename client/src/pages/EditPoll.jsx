import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_PollById } from "../api/pollApi";
import { update_Poll } from "../api/pollApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from 'react-loader-spinner'


function EditPoll() {
  const { quizId } = useParams();
 const { userId } = useParams();
  const [items, setItems] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);
  const fetchQuiz = async () => {
    const response = await get_PollById(quizId);
    if (response.data) {
      setItems(response.data.pollArray);
    }
  };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [validationMessages, setValidationMessages] = useState({
    question: "",
    input: "",
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

  const updatePoll = async () => {
    const newValidationMessages = {
      question: "",
      input: "",
    };

    const allQuestionsFilled = items.every(
      (item) => item.question.trim() !== ""
    );
    const allInputsFilled = items.every((item) =>
      item.inputs.every(
        (input) =>
          input.text.trim() !== "" &&
          (item.type !== "both" || input.imageUrl.trim() !== "")
      )
    );

    if (!allQuestionsFilled) {
      newValidationMessages.question =
        "Please fill in the question for every item.";
    }

    if (!allInputsFilled) {
      newValidationMessages.input =
        "Please fill in all option fields for every question.";
    }

    setValidationMessages(newValidationMessages);

    if (allQuestionsFilled && allInputsFilled) {
      const response = await update_Poll(items, quizId);
      console.log(items);

      if (response.status === 201) {
        console.log("Poll updated successfully!");
        navigate(`/share_quiz/${userId}/${quizId}`);
      } else {
        toast.error("Failed to update poll");
        
      }
    } else {
      if (newValidationMessages.question) {
        toast.error(newValidationMessages.question);
        
       
      }
      if (newValidationMessages.input) {
        toast.error(newValidationMessages.input);
        
      }
    }
  };

  if (!items) {
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}> <Audio
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
                      placeholder="Poll question"
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
                      <div  style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }} key={inputIndex}>
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
                            className={`option-input `}
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
                            className={`option-input`}
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
                              className={`option-input  `}
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
                              className={`option-input `}
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
                          selectedItem.timer === "5sec" ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimerChange(selectedItemIndex, "5sec")
                        }
                      >
                        5 seconds
                      </button>
                      <button
                        className={`timer-button ${
                          selectedItem.timer === "10sec" ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimerChange(selectedItemIndex, "10sec")
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
                onClick={updatePoll}
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

export default EditPoll;

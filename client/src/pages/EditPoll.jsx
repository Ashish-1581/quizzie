import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_PollById } from "../api/pollApi";
import { update_Poll } from "../api/pollApi";
import { useNavigate } from "react-router-dom";
function EditPoll() {
  const { quizId } = useParams();
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
        "Please fill in all input fields for every item.";
    }

    setValidationMessages(newValidationMessages);

    if (allQuestionsFilled && allInputsFilled) {
      const response = await update_Poll(items, quizId);
      console.log(items);

      if (response.status === 201) {
        console.log("Poll updated successfully!");
        navigate(`/share_quiz/${quizId}`);
      } else {
        console.log("Failed to create poll", response.error);
      }
    } else {
      if (newValidationMessages.question) {
        console.log(newValidationMessages.question);
      }
      if (newValidationMessages.input) {
        console.log(newValidationMessages.input);
      }
    }
  };
  if (!items) return;
  const selectedItem = items[selectedItemIndex];

  return (
    <>
      <h1>EditPoll</h1>
      {items && (
        <div>
          <div className="items-container">
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleItemClick(index)}
                    className={`item-button ${
                      index === selectedItemIndex ? "selected" : ""
                    }`}
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <div>
              <h3>Editing {selectedItem.name}</h3>

              <div>
                <label>
                  Question:
                  <input
                    type="text"
                    value={selectedItem.question}
                    onChange={(e) =>
                      handleQuestionChange(selectedItemIndex, e.target.value)
                    }
                    placeholder="Enter the question"
                  />
                </label>
              </div>

              {selectedItem.inputs.map((input, inputIndex) => (
                <div key={inputIndex}>
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
                      placeholder={`Input ${inputIndex + 1}`}
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
                      placeholder={`Image URL ${inputIndex + 1}`}
                    />
                  )}

                  {selectedItem.type === "both" && (
                    <div>
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
                        placeholder={`Text ${inputIndex + 1}`}
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
                        placeholder={`Image URL ${inputIndex + 1}`}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Timer Options */}
              <div>
                <h4>Set Timer</h4>
                <div className="timer-options">
                  <button
                    className={`timer-button ${
                      selectedItem.timer === "off" ? "selected" : ""
                    }`}
                    onClick={() => handleTimerChange(selectedItemIndex, "off")}
                  >
                    Off
                  </button>
                  <button
                    className={`timer-button ${
                      selectedItem.timer === "5sec" ? "selected" : ""
                    }`}
                    onClick={() => handleTimerChange(selectedItemIndex, "5sec")}
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

          {/* Validation messages */}
          {validationMessages.question && (
            <p style={{ color: "red" }}>{validationMessages.question}</p>
          )}
          {validationMessages.input && (
            <p style={{ color: "red" }}>{validationMessages.input}</p>
          )}

          {/* Create Quiz Button */}
          <button onClick={updatePoll}>Update Poll</button>
        </div>
      )}
    </>
  );
}

export default EditPoll;

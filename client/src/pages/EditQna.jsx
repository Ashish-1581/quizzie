import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_QnaById } from "../api/qnaApi";
import { update_Qna } from "../api/qnaApi";
import{useNavigate} from "react-router-dom";

function EditQna() {
    const { quizId } = useParams();
    const [items, setItems] = useState(null);
    const navigate = useNavigate();

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
        console.log("Qna updated successfully!");
        navigate(`/share_quiz/${quizId}`);
      }

    } else {
      // Show individual validation messages
      if (newValidationMessages.question) {
        console.log(newValidationMessages.question); // Replace with toast notification
      }
      if (newValidationMessages.input) {
        console.log(newValidationMessages.input); // Replace with toast notification
      }
      if (newValidationMessages.answer) {
        console.log(newValidationMessages.answer); // Replace with toast notification
      }
    }
  };

  if(!items) {return <div>Loading...</div>}

  const selectedItem = items[selectedItemIndex];
  return (
    <>
    <h1>EditQna</h1>
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
    
                  <label>
                    <input
                      type="radio"
                      name={`answer-${selectedItemIndex}`}
                  
                      checked={selectedItem.answerIndex === inputIndex}
                    //   onChange={() =>
                    //     handleAnswerSelect(selectedItemIndex, inputIndex)
                    //   }
                    />
                    Set as Answer
                  </label>
    
                
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
                      selectedItem.timer === "5" ? "selected" : ""
                    }`}
                    onClick={() => handleTimerChange(selectedItemIndex, "5")}
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

          {/* Validation messages */}
          {validationMessages.question && (
            <p style={{ color: "red" }}>{validationMessages.question}</p>
          )}
          {validationMessages.input && (
            <p style={{ color: "red" }}>{validationMessages.input}</p>
          )}

          
          <button onClick={updateQna}>Update Qna</button>
        </div>
      )}
    </>
   
  )
}

export default EditQna
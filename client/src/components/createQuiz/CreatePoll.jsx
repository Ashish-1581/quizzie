import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { create_Poll } from "../../api/pollApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiDeleteBin6Fill } from "react-icons/ri";



const CreatePoll = ({ quizId }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [items, setItems] = useState([
    {
      name: "Item 1",
      question: "",
      type: "text",
      inputs: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
      timer: "off",
    },
  ]);

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

  const handleTypeChange = (type) => {
    const newItems = [...items];
    newItems[selectedItemIndex].type = type;

    // Ensure each input has both text and imageUrl when type is "both"
    if (type === "both") {
      newItems[selectedItemIndex].inputs = newItems[
        selectedItemIndex
      ].inputs.map(() => ({
        text: "",
        imageUrl: "",
      }));
    } else {
      newItems[selectedItemIndex].inputs = newItems[
        selectedItemIndex
      ].inputs.map(() => ({
        text: "",
      }));
    }

    setItems(newItems);
  };

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const addInputField = (index) => {
    const newItems = [...items];
    if (newItems[index].inputs.length < 4) {
      newItems[index].inputs.push({ text: "", imageUrl: "" });
      setItems(newItems);
    }
  };

  const removeInputField = (index, inputIndex) => {
    const newItems = [...items];
    if (newItems[index].inputs.length > 2 && inputIndex >= 2) {
      newItems[index].inputs.splice(inputIndex, 1);
      setItems(newItems);
    }
  };

  const addNewItem = () => {
    const newItem = {
      name: `Item ${items.length + 1}`,
      question: "",
      type: "text",
      inputs: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
      timer: "off",
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleTimerChange = (index, timerValue) => {
    const newItems = [...items];
    newItems[index].timer = timerValue;
    setItems(newItems);
  };

  const createPoll = async () => {
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
      const response = await create_Poll(items, quizId, token);
      console.log(items);

      if (response.status === 201) {
        toast.success("Quiz created successfully!");
      
        navigate(`/share_quiz/${userId}/${quizId}`);
      } else {
        console.log("Failed to create poll", response.error);
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

  const selectedItem = items[selectedItemIndex];

  return (
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
      <div className="items-container">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="items-list">
            {items.map((item, index) => (
              <div className="item" key={index}>
                <button
                  onClick={() => handleItemClick(index)}
                  className={`item-button ${
                    index === selectedItemIndex ? "selected" : ""
                  }`}
                >
                  {index + 1}
                </button>
                <button className="button-x" onClick={() => deleteItem(index)}>
                  X
                </button>
              </div>
            ))}
          </div>
          {items.length < 5 && (
            <button onClick={addNewItem} className="add-item-button">
              +
            </button>
          )}
        </div>
        <div style={{ color: "#9f9f9f", fontSize: "1rem" }}>
          Max 5 questions
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
              alignItems: "center",
              justifyContent: "space-between",
              color: "#9F9F9F",
              marginTop: "10px",
            }}
          >
            <h3 style={{ color: "#9F9F9F", fontSize: "1.5rem" }}>
              Option type
            </h3>
            <label>
              <input
                type="radio"
                name="inputType"
                checked={selectedItem.type === "text"}
                onChange={() => handleTypeChange("text")}
              />
              Text
            </label>
            <label>
              <input
                type="radio"
                name="inputType"
                checked={selectedItem.type === "imageUrl"}
                onChange={() => handleTypeChange("imageUrl")}
              />
              Image URL
            </label>
            <label>
              <input
                type="radio"
                name="inputType"
                checked={selectedItem.type === "both"}
                onChange={() => handleTypeChange("both")}
              />
              Both
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {selectedItem.inputs.map((input, inputIndex) => (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }} key={inputIndex}>
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
                    placeholder="Text"
                    className={`option-input`}
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
                    placeholder="Image URL"
                    className={`option-input `}
                  />
                )}

                {selectedItem.type === "both" && (
                  <div    style={{
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
                      placeholder="Text"
                        className={`option-input `}
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
                      placeholder="Image URL"
                      className={`option-input `}
                    />
                  </div>
                )}

                {inputIndex >= 2 && (
                  <button
                    onClick={() =>
                      removeInputField(selectedItemIndex, inputIndex)
                    }
                    style={{
                      outline: "none",
                      border: "none",
                      background: "none",
                      color: "#D60000",
                      fontSize: "1rem",
                    }}
                  >
                  <RiDeleteBin6Fill />
                  </button>
                )}
              </div>
            ))}

            {selectedItem.inputs.length < 4 && (
              <button className="add-option-button" onClick={() => addInputField(selectedItemIndex)}>
                Add Option
              </button>
            )}
          </div>

          <div className="timer">
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
                onClick={() => handleTimerChange(selectedItemIndex, "10sec")}
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
          onClick={createPoll}
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;

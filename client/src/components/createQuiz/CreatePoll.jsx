import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { create_Poll } from "../../api/pollApi";
import { useNavigate } from "react-router-dom";

const CreatePoll = ({ quizId }) => {
  const navigate = useNavigate();
  const token=localStorage.getItem('token');
  
  const [items, setItems] = useState([
    {
      name: "Item 1",
      question: "",
      type: "text",
      inputs: [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }],
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
      newItems[selectedItemIndex].inputs = newItems[selectedItemIndex].inputs.map(() => ({
        text: "",
        imageUrl: "",
      }));
    } else {
      newItems[selectedItemIndex].inputs = newItems[selectedItemIndex].inputs.map(() => ({
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
        { text: "", imageUrl: "" }
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

    const allQuestionsFilled = items.every((item) => item.question.trim() !== "");
    const allInputsFilled = items.every((item) =>
      item.inputs.every((input) => input.text.trim() !== "" && (item.type !== "both" || input.imageUrl.trim() !== ""))
    );

    if (!allQuestionsFilled) {
      newValidationMessages.question = "Please fill in the question for every item.";
    }

    if (!allInputsFilled) {
      newValidationMessages.input = "Please fill in all input fields for every item.";
    }

    setValidationMessages(newValidationMessages);

    if (allQuestionsFilled && allInputsFilled) {
      const response = await create_Poll(items, quizId,token);
      console.log(items);

      if (response.status === 201) {
        console.log("Poll created successfully!");
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

  const selectedItem = items[selectedItemIndex];

  return (
    <div>
      <div className="items-container">
        <div className="items-list">
          {items.map((item, index) => (
            <div   key={index} >
            <button
            
              onClick={() => handleItemClick(index)}
              className={`item-button ${index === selectedItemIndex ? "selected" : ""}`}
            >
              {item.name}
            </button>
            <button onClick={()=>deleteItem(index)}>X</button>
            </div>
          ))}
        </div>
        {items.length < 5 && (
          <button onClick={addNewItem} className="add-item-button">
            Add New Item
          </button>
        )
        }
        
        
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
                onChange={(e) => handleQuestionChange(selectedItemIndex, e.target.value)}
                placeholder="Enter the question"
              />
            </label>
          </div>

          <div>
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

          {selectedItem.inputs.map((input, inputIndex) => (
            <div key={inputIndex}>
              {selectedItem.type === "text" && (
                <input
                  type="text"
                  value={input.text}
                  onChange={(e) => handleInputChange(selectedItemIndex, inputIndex, "text", e.target.value)}
                  placeholder={`Input ${inputIndex + 1}`}
                />
              )}

              {selectedItem.type === "imageUrl" && (
                <input
                  type="text"
                  value={input.imageUrl}
                  onChange={(e) => handleInputChange(selectedItemIndex, inputIndex, "imageUrl", e.target.value)}
                  placeholder={`Image URL ${inputIndex + 1}`}
                />
              )}

              {selectedItem.type === "both" && (
                <div>
                  <input
                    type="text"
                    value={input.text}
                    onChange={(e) => handleInputChange(selectedItemIndex, inputIndex, "text", e.target.value)}
                    placeholder={`Text ${inputIndex + 1}`}
                  />
                  <input
                    type="text"
                    value={input.imageUrl}
                    onChange={(e) => handleInputChange(selectedItemIndex, inputIndex, "imageUrl", e.target.value)}
                    placeholder={`Image URL ${inputIndex + 1}`}
                  />
                </div>
              )}

              {inputIndex >= 2 && (
                <button onClick={() => removeInputField(selectedItemIndex, inputIndex)}>Remove</button>
              )}
            </div>
          ))}

          {selectedItem.inputs.length < 4 && (
            <button onClick={() => addInputField(selectedItemIndex)}>Add Input Field</button>
          )}

          {/* Timer Options */}
          <div>
            <h4>Set Timer</h4>
            <div className="timer-options">
              <button
                className={`timer-button ${selectedItem.timer === "off" ? "selected" : ""}`}
                onClick={() => handleTimerChange(selectedItemIndex, "off")}
              >
                Off
              </button>
              <button
                className={`timer-button ${selectedItem.timer === "5sec" ? "selected" : ""}`}
                onClick={() => handleTimerChange(selectedItemIndex, "5sec")}
              >
                5 seconds
              </button>
              <button
                className={`timer-button ${selectedItem.timer === "10sec" ? "selected" : ""}`}
                onClick={() => handleTimerChange(selectedItemIndex, "10sec")}
              >
                10 seconds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation messages */}
      {validationMessages.question && <p style={{ color: "red" }}>{validationMessages.question}</p>}
      {validationMessages.input && <p style={{ color: "red" }}>{validationMessages.input}</p>}

      {/* Create Quiz Button */}
      <button onClick={createPoll}>Create Poll</button>
    </div>
  );
};

export default CreatePoll;

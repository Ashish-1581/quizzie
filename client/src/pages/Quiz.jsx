import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { get_PollById } from "../api/pollApi";
import{get_QnaById} from "../api/qnaApi";
import { create_Response } from "../api/responseApi";
import{get_QuizById,update_Quiz} from "../api/quizApi";



function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState({});
  const [items, setItems] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [pollData, setPollData] = useState([]);
  const [qnaData, setQnaData] = useState([]);
  const[correct,setCorrect]=useState(0);
  const[pollSubmit,setPollSubmit]=useState(false);
  const[qnaSubmit,setQnaSubmit]=useState(false);
  const [timeLeft, setTimeLeft] = useState(null);



 



  useEffect(() => {
    const fetchAndUpdateViews = async () => {
    
      try {
        const currentViews = await get_QuizById( quizId );
      
        
        const newViews = currentViews.data.impression + 1;
       
       const response= await update_Quiz({ quizId, impression: newViews });
     
     
        
      } catch (error) {
        console.error('Error updating views:', error);
      }
    }
    

    fetchAndUpdateViews();
  },[quizId]);
 


 



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
    if (selectedItem && selectedItem.timer !== 'off') {
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

      return () => clearTimeout(timerId); // Cleanup function to clear the timeout
    }

    if (timeLeft === 0) {
      handelNext(); // Automatically move to the next item when time runs out

      if (selectedItemIndex === items.length - 1) {
        handelSubmit(); // Submit the quiz when time runs out on the last item

        setTimeLeft(null); // Stop the timer

        return;

      }
      
    }
  }, [timeLeft]);

  

  




  const handelNext = () => {
    if (selectedItemIndex < items.length - 1) {

      setSelectedItemIndex(prevIndex => prevIndex + 1);
      
    }
  };
  const handelClick = (index) => {
  
    if (quiz.type === "poll") {
     
      setPollData((prev) => [...prev, { name: items[selectedItemIndex].name, answer: index }]);


    } else if (quiz.type === "qna") {
   
      if (index === items[selectedItemIndex].answerIndex) {
        setCorrect((prev)=>prev+1);
        console.log("correct");
        setQnaData((prev) => [...prev, {name: items[selectedItemIndex].name, answer: 1 }]);
      }
      else {
        console.log("incorrect");
        setQnaData((prev) => [...prev, {name: items[selectedItemIndex].name, answer: 0 }]);
      }
      
    }
  };

  const handelSubmit = async() => {
    if(quiz.type==="poll"){

      if(pollData.length!==0){
       
        const res=await create_Response(quizId,pollData);
        if(res.status===200){
          console.log("Poll Submitted");
          setTimeLeft(null);
        }
      }
      
      setPollSubmit(true);
      
    }
    else if(quiz.type==="qna" ){
      if(qnaData.length!==0){

    const res=await create_Response(quizId,qnaData);
    if(res.status===200){
    console.log("Qna Submitted");
    setTimeLeft(null);
      }
    }
    setQnaSubmit(true);
    }
  };


 


  return (
    <>
    
      <h1>quiz {quiz.type}</h1>
      {!pollSubmit && !qnaSubmit && selectedItem && (
        <div>
        <h1>{selectedItem.question}</h1>
        {timeLeft !== null && <h3>Time Left: {timeLeft} seconds</h3>}
        {selectedItem.inputs.map((input, index) => (
          <div key={index}>
            {selectedItem.type === "text" && (
              // Display as text input
              <button onClick={() => handelClick(index)}>{input.text}</button>
            )}
      
            {selectedItem.type === "imageUrl" && (
              // Display as an image if the type is 'imageUrl'
              <div >
                <img src={input.imageUrl} alt={`Input ${index + 1}`} style={{ width: "200px", height: "auto" }} />
                <button onClick={() => handelClick(index)}>Select Image</button>
              </div>
            )}
      
            {selectedItem.type === "both" && (
              // Display both text and image if the type is 'both'
              <div>
                <p>{input.text}</p>
                <img src={input.imageUrl} alt={`Input ${index + 1}`} style={{ width: "200px", height: "auto" }} />
                <button onClick={() => handelClick(index)}>Select Both</button>
              </div>
            )}
          </div>
        ))}
      
        {selectedItemIndex < items.length - 1 ? (
          <button onClick={() => handelNext()}>Next</button>
        ) : (
          <button onClick={() => handelSubmit()}>Submit</button>
        )}
      </div>
      )}
      {pollSubmit && (
        <div>
          congo poll submitted
        </div>
      )} 
      {qnaSubmit && (
        <div>
          <h1>congo qna submitted</h1>
          <h1>score:0{correct}/0{items.length}</h1>
        </div>)}
    </>
  );
}

export default Quiz;


import React, { useState } from 'react';
import { create_Quiz } from '../api/quizApi';
import {useNavigate} from 'react-router-dom';
import CreateQnA from '../components/createQuiz/CreateQnA';
import CreatePoll from '../components/createQuiz/CreatePoll';


function CreateQuiz() {
  const [quizType, setQuizType] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizId, setQuizId] = useState('');
  const[isPoll,setIsPoll]=useState(false);
  const[isQna,setIsQna]=useState(false);
  
 

    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    

  const handleCreate = async() => {
    if (quizTitle.trim() === '' || quizType === '') {
      console.log('Please provide both a quiz title and a quiz type.');
      return;
    }

    const quiz = {
      title: quizTitle,
      type: quizType,
    };
    const response=await create_Quiz(quiz,token);
    if(response.status===201){
      console.log('Quiz created successfully!');
     

      setQuizId(response.data._id);
      if(quizType==='poll'){
        setIsPoll(true);
      }
      else if(quizType==='qna'){
        setIsQna(true);
      }
       
      
    }

  };

  const handleQuizTypeChange = (event) => {
    setQuizType(event.target.value);
  };

  return (
    <>{!isPoll && !isQna && (
    <div>
      <input
        type="text"
        placeholder="Enter Quiz Title"
        onChange={(e) => setQuizTitle(e.target.value)}
      />
      <h3>Quiz type</h3>
      <input
        type="radio"
        name="quizType"
        value="qna"
        onChange={handleQuizTypeChange}
      />{' '}
      QnA
      <input
        type="radio"
        name="quizType"
        value="poll"
        onChange={handleQuizTypeChange}
      />{' '}
      Poll
      <button onClick={handleCreate}>Create</button>
      </div>)}
      {isPoll && <CreatePoll quizId={quizId}/>}
      {isQna && <CreateQnA quizId={quizId}/>}

    </>
  );
}

export default CreateQuiz;
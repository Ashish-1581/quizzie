import React, { useEffect, useState } from 'react'
import {get_Quizzes,delete_Quiz  } from '../../api/quizApi'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import QnaResponse from '../Analysis/QnaResponse';
import PollResponse from '../Analysis/PollResponse';



function Analysis() {
  const [quizzes, setQuizzes] = useState([]);
  const [isPoll, setIsPoll] = useState(false);
  const [isQna, setIsQna] = useState(false);
  const [quizId, setQuizId] = useState('');

  const token=localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);
  const fetchQuizzes = async () => {
    const response = await get_Quizzes(token);
    if (response.data) {
      setQuizzes(response.data);
    }
  }


  const handelDelete = async (quizId) => {
    const response = await delete_Quiz(quizId);
    if (response.status === 200) {
      fetchQuizzes();
    }
  }
  const handelShare=(quizId)=>{
    let path = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(path).then(()=>{
      toast.success('Link copied to clipboard');
       
    }
    ).catch((error)=>{
        console.error('Error copying text:',error);
    });
}

  const handelEdit=(quizId,type)=>{
    if(type==='poll'){
      navigate(`/edit_poll/${quizId}`);
    }
    else{
      navigate(`/edit_qna/${quizId}`);
    }
   
  }

  const questionWiseAnalysis=(quizId,type)=>{
    if(type==='poll'){
      setQuizId(quizId);
      setIsPoll(true);
    }
    else{
      setQuizId(quizId);
      setIsQna(true);
    }
  }


  return (
    <>
    <h1>Analysis</h1>

    {!quizzes.length  && !isPoll && !isQna && <p>No quizzes found</p>}

   
    
   { quizzes.length>0 && !isPoll && !isQna && (<div>
    {
      quizzes.map((quiz, index) => (
        <div key={index}>
          <h3>{quiz.title}</h3>
          <p>{quiz.createdAt}</p>
          <p>{quiz.impression}</p>
          <button onClick={()=>handelEdit(quiz._id,quiz.type)}>edit</button>
          <button onClick={()=>handelDelete(quiz._id)}>delete</button>
          <button onClick={()=>handelShare(quiz._id)}>Share</button>
         <Link onClick={()=>questionWiseAnalysis(quiz._id,quiz.type)}>Question wise analysis</Link>
        </div>
      ))
    }
    </div>)
  }

  {isPoll && <PollResponse quizId={quizId}/>} 
  {isQna && <QnaResponse quizId={quizId}/>}

    </>
  )
}

export default Analysis
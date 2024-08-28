import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify';

function ShareQuiz() {
    const { quizId } = useParams();
    let path = `${window.location.origin}/quiz/${quizId}`;
    const handelShare=()=>{
        navigator.clipboard.writeText(path).then(()=>{
          toast.success('Link copied to clipboard');
           
        }
        ).catch((error)=>{
            console.error('Error copying text:',error);
        });
    }
  return (
    <>
    <h3>ShareQuiz</h3>
    <input value={path} disabled type="text"  />
    <button onClick={handelShare}>Share</button>

    </>
    
    

  )
}

export default ShareQuiz
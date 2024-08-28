import React, { useEffect, useState } from 'react'
import {get_Quizzes} from '../../api/quizApi';

function Display() {
    const token=localStorage.getItem("token");
    const [quizzes, setQuizzes] = useState([]);
   
    const fetchQuizzes = async () => {
        const response = await get_Quizzes(token);
       
        if (response.data) {
            setQuizzes(response.data);
        }
    }
    useEffect(() => {
        fetchQuizzes();
    }, []);

  return (
    <>
    <h1>Display</h1>
    <div>
    <h2>trending quiz</h2>
    {quizzes.map((quiz) => (
        <div key={quiz._id}>
        
            <h3>title:{quiz.title}</h3>
            <h4>impression:{quiz.impression}</h4>
            <p>createdAt:{quiz.createdAt}</p>
        </div>
    ))}

    </div>


    </>
  )
}

export default Display
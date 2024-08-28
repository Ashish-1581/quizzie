import React from 'react'
import{get_ResponseById} from '../../api/responseApi'
import{get_QnaById} from '../../api/qnaApi'

import {useState,useEffect} from 'react'

function QnaResponse({quizId}) {
  const [response, setResponse] = useState(null);
  const [qna, setQna] = useState(null);

  useEffect(() => {
    fetchResponse();
    fetchQna();
}, [quizId])
 const fetchResponse = async () => {
        const res = await get_ResponseById(quizId);
        if(res.status===200){
          console.log(res.data);
            setResponse(res.data);

     
           
            
        }
    }

    const fetchQna = async () => {
        const res = await get_QnaById(quizId);
        if(res.data){
          console.log(res.data.qnaArray);
          setQna(res.data.qnaArray);
           
        }
    }

if(!response || !qna){ 
    return <div>Loading...</div>
}
     // Create an object to count the number of correct and incorrect answers for each question
  const results = qna.map((item) => {
    let correctCount = 0;
    let incorrectCount = 0;

    // Loop through each response and count correct and incorrect answers
    response.forEach((res) => {
      res.responseData.forEach((data) => {
        if (data.name === item.name) {
          if (data.answer === 1) {
            correctCount++;
          } else if (data.answer === 0) {
            incorrectCount++;
          }
        }
      });
    });
    const totalAttempts = correctCount + incorrectCount;

    return {
      question: item.question,
      correctCount,
      incorrectCount,
      totalAttempts,
    };
  });

  
  return (
    <>
    
    <div>
    <h2>Q&A Results</h2>
    {results.map((result, index) => (
      <div key={index}>
        <h3>{result.question}</h3>
        <p>Total Attempts: {result.totalAttempts} times</p>
        <p>Correct: {result.correctCount} times</p>
        <p>Incorrect: {result.incorrectCount} times</p>
      </div>
    ))}
  </div>

    </>
  )
}

export default QnaResponse
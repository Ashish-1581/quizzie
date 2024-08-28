import React from 'react'
import{get_ResponseById} from '../../api/responseApi'

import {useState,useEffect} from 'react'
import {get_PollById} from '../../api/pollApi'

function PollResponse({quizId}) {
    
 const [response, setResponse] = useState(null);
 const [poll, setPoll] = useState(null);
 useEffect(() => {
    fetchResponse();
    fetchPoll();
}, [quizId])
 const fetchResponse = async () => {
        const res = await get_ResponseById(quizId);
        if(res.status===200){
          console.log(res.data);
            setResponse(res.data);

     
           
            
        }
    }

    const fetchPoll = async () => {
        const res = await get_PollById(quizId);
        if(res.data){
          setPoll(res.data.pollArray);
           
        }
    }

if(!response || !poll){
    return <div>Loading...</div>
}

const resultCounts = poll.map((item) => ({
  name: item.name,
  counts: item.inputs.map((_, index) => ({
    option: `Option ${index + 1}`,
    count: response.reduce((count, res) => {
      const matchingAnswers = res.responseData.filter(
        (responseItem) => responseItem.name === item.name && responseItem.answer === index
      );
      return count + matchingAnswers.length;
    }, 0),
  })),
}));
    

    

   
  return (
    <>
    <div>
    <h2>Poll Results</h2>
    {resultCounts.map((result, index) => (
      <div key={index}>
        <h3>{result.name}</h3>
        {result.counts.map((count, countIndex) => (
          <p key={countIndex}>
            {count.option} count = {count.count}
          </p>
        ))}
      </div>
    ))}
  </div>

    </>
    
  )
}

export default PollResponse
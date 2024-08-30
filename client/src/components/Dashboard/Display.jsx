import React, { useEffect, useState } from 'react'
import {get_Quizzes} from '../../api/quizApi';
import { FaEye } from "react-icons/fa";


function Display() {
    const token=localStorage.getItem("token");
    const [quizzes, setQuizzes] = useState([]);
   
    const fetchQuizzes = async () => {
        const response = await get_Quizzes(token);
       
        if (response.data) {
          
            response.data.map((quiz)=>{
                if(quiz.impression>=10){
                    setQuizzes((prev)=>{return [...prev,quiz]})
                
            }})
         

           
        }
    }
    useEffect(() => {
        fetchQuizzes();
    }, []);

  return (
    <>
  
    <div>
    <h2 style={{marginTop:"50px",fontSize:"2rem"}}>Trending Quizs</h2>

    {quizzes.length>0?(
    <div style={{display:"flex",flexWrap:"wrap",gap:"50px",marginTop:"30px"}} >
    {quizzes.map((quiz) => (
        <div style={{ display: "flex",
            justifyContent: "center",
            alignTtems: "center",
            flexDirection: "column",
            padding: "10px 10px",
            borderRadius:"5px" ,
            backgroundColor: "#FFFFFF",
            height: "50px",
            width: "170px",
           
        }}  key={quiz._id}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        
        <h3>{quiz.title}</h3>
        <p style={{color:"#FF5D01",fontWeight:"bolder",fontSize:"1rem"}}>{quiz.impression} {<FaEye  />}</p>
        </div>
        
            <p style={{color:"#60B84B",fontWeight:"bolder",fontSize:"0.8rem"}}>Created on:{quiz.createdAt}</p>
        </div>
    ))}
    </div>):<h1 style={{textAlign:"center",marginTop:"150px",color:"#9F9F9F",fontSize:"5rem"}}>No Trending Quizs</h1>}

    </div>


    </>
  )
}

export default Display
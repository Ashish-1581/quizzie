import React from 'react'
import trophy from "../../assets/trophy.png";

function QnaSubmitted({correct,total}) {
  return (
    <>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",padding:"20px",textAlign:"center"}} >
    <h1 >Congrats Quiz is Completed</h1>
   
    <img src={trophy} alt="trophy" style={{width:"40%",height:"40%"}}/>
    <div style={{fontWeight:"bolder",fontSize:"2rem"}}>
    <span  >Your score is </span>{" "}<span style={{color:"#60B84B"}}>0{correct}/0{total}</span> 
    </div>

    
    </div>
  
    
    </>
  )
}

export default QnaSubmitted
import React, { useState } from "react";
import { PiLineVerticalLight } from "react-icons/pi";
import styles from "./DeleteQuizModel.module.css";
const DeleteQuizModel = ({ isOpen, onClose, onDelete }) => {
  const Delete = () => {
    onDelete();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 style={{fontSize:"1.5rem"}}>Are you confirm you want to delete this Quiz?</h3>

        <div style={{ display: "flex", justifyContent: "space-around" ,margin:"20px 0"}}>
          <button onClick={Delete} className={styles.button} style={{background:"#FF4B4B",color:"white"}}>
            Confirm
          </button>

          <PiLineVerticalLight style={{ fontSize: "2rem", color: "#2e2e34" }} />

          <button onClick={onClose} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



export default DeleteQuizModel;

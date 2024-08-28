const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');

const {createQuiz,getQuizzes,getQuizById,update_Quiz,deleteQuiz}=require('../controller/quiz');

router.post('/createQuiz',authMiddleware,createQuiz);
router.get('/getQuizzes',authMiddleware,getQuizzes);
router.get('/getQuiz/:quizId',getQuizById);
router.patch('/updateQuiz',update_Quiz);
router.delete('/deleteQuiz/:quizId',deleteQuiz);

module.exports=router;

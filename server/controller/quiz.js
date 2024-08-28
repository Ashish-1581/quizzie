const Quiz = require('../models/quizModel');
const Poll=require('../models/pollModel');
const Qna=require('../models/qnaModel');

const createQuiz= async (req, res) => {
  try {

    const data= req.body;
    

    const quiz =  await Quiz.create({...data,userId:req.userId});
    
    
    res.status(201).send(quiz);
  } catch (error) {
    res.status(400).send(error);
  }

};

const getQuizzes = async (req, res) => {
    try {
       
        const quiz = await Quiz.find({userId:req.userId});
        
        res.status(200).send(quiz);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        res.status(200).send(quiz);
    } catch (error) {
        res.status(400).send(error);
    }

  

    
}

const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
        await Poll.deleteMany({quizId:req.params.quizId});
        await Qna.deleteMany({quizId:req.params.quizId});
        res.status(200).send(quiz);
    } catch (error) {
        res.status(400).send(error);
    }
}




const update_Quiz = async (req, res) => {
    try {
        const { quizId, impression } = req.body;
        const quiz= await Quiz.findOneAndUpdate({ _id: quizId }, { impression }, { new: true });


        
       

        res.status(200).json(quiz);
        
        
    }
    catch (error) {
        res.status(400).send(error)
    }
}







module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    update_Quiz,
    deleteQuiz
    };
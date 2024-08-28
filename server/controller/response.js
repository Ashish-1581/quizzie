const Response=require('../models/responseModel');


const createResponse = async (req, res) => {
    try {
        const quizId=req.params.quizId;
        const respo =  Response.create({responseData:req.body,quizId});
        
        res.status(200).json(respo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const get_ResponseById = async (req, res) => {
    try {
        const quizId=req.params.quizId;
        const respo = await Response
            .find({ quizId: quizId })
          

        res.status(200).json(respo);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    createResponse,
    get_ResponseById
};
      


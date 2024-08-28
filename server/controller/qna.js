const Qna=require('../models/qnaModel');


const createQna = async (req, res) => {
    const qnaData = req.body; 
    const quizId = req.params.quizId; 
    
    try {
        const newDocument = await Qna.create({ qnaArray: qnaData, quizId,userId:req.userId });
        res.status(201).send(newDocument); 
    } catch (error) {
        res.status(400).send({ error: 'Failed to create QnA', details: error.message });
    }
};

const getQnas=async(req,res)=>{
    const {userId}=req.query;
    try{
        
        const qnas=await Qna.find({userId});
        res.status(200).send(qnas);
    }catch(error){
        res.status(500).send({message:"Error in Fetching qnas"});
    }
}

const getQnaById=async(req,res)=>{
    try{
        const qna=await Qna.findOne({quizId:req.params.quizId});
       
        res.status(200).send(qna);
    }catch(error){
        res.status(500).send({message:"Error in Fetching qna"});
    }
}

const updateQna=async(req,res)=>{
    const qnaData=req.body;
    const quizId=req.params.quizId;
    try{
        const qna=await Qna.findOneAndUpdate({quizId},{ qnaArray: qnaData });
        res.status(201).send(qna);
    }
    catch(error){
        res.status(400).send({error:'Failed to update qna',details:error.message});
    }
}




module.exports={
    createQna,
    getQnas,
    getQnaById,
    updateQna
};
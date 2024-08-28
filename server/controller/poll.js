const Poll = require("../models/pollModel");

const createPoll = async (req, res) => {
  const pollData = req.body; 
  const quizId = req.params.quizId;
 
  try {
    const poll = await Poll.create({pollArray:pollData,quizId,userId:req.userId}); 
    res.status(201).send(poll); 
  } catch (error) {
    res.status(400).send({ error: 'Failed to create poll', details: error.message });
  }
};

const getPolls = async (req, res) => {
  try {
    const {userId}=req.query;
    
    const polls = await Poll.find({userId});
    res.status(200).send(polls);
  } catch (error) {
    res.status(500).send({ message: "Error in Fetching polls" });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findOne({quizId:req.params.quizId});
    res.status(200).send(poll);
  } catch (error) {
    res.status(500).send({ message: "Error in Fetching poll" });
  }
}

const updatePoll = async (req, res) => {
  const pollData = req.body;
  const quizId = req.params.quizId;
  try {
    const poll = await Poll.findOneAndUpdate ({quizId}, {pollArray:pollData});
    res.status(201).send(poll);
  }
  catch (error) {
    res.status(400).send({ error: 'Failed to update poll', details: error.message });
  }

}



module.exports = {
  createPoll,
  getPolls,
  getPollById,
  updatePoll
};



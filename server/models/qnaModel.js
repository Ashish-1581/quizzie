const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Quiz=require('./quizModel');
const User=require('./userModel');

const inputSchema=new Schema({
    text: {
      type: String,
      
    },
    imageUrl: {
      type: String,
      
    },
  });

const qnaSchema = new Schema({
    answerIndex: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    inputs: {
           type: [inputSchema],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    timer: {
        type: String,
        
    },
    type: {
        type: String,
        required: true,
    },


  

});

// Define the schema for a document that contains an array of QnA entries
const documentSchema = new Schema({
    qnaArray: [qnaSchema] ,
    quizId: {
        type: Schema.Types.ObjectId,
        ref: Quiz,
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
});

module.exports = mongoose.model('Qna', documentSchema);
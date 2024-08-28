const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Quiz=require('./quizModel');

const inputSchema=new Schema({
    name: {
      type: String,
      
    },
    answer: {
      type: Number,
      
    },
  });

  const responseSchema = new Schema({
    responseData: [inputSchema],
   
    
    quizId: {
      type: Schema.Types.ObjectId,
      ref: Quiz,
      required: true,
    },
  });

module.exports = mongoose.model('Response', responseSchema);
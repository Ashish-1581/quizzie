const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Quiz = require("./quizModel");
const User=require('./userModel');

const inputSchema=new Schema({
  text: {
    type: String,
    
  },
  imageUrl: {
    type: String,
   
  },
});


const pollSchema = new Schema({
  
    question: {
      type: String,
      required: true,
    },
    inputs: 
      {
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

const documentSchema = new Schema({
  pollArray: [pollSchema], // Array of QnA entries
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

module.exports = mongoose.model("Poll", documentSchema);



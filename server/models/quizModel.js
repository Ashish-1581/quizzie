const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
const User = require("./userModel");

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: () => moment().format("DD MMM,YYYY"), // Format example: July 15, 3:30pm
  },
  impression: {
    type: Number,
    default: 0,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);

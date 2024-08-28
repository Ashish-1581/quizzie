const { createPoll, getPolls,getPollById ,updatePoll} = require("../controller/poll");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/createPoll/:quizId",authMiddleware, createPoll);
router.get("/getPolls", getPolls);
router.get("/getPoll/:quizId", getPollById);
router.patch("/updatePoll/:quizId", updatePoll);

module.exports = router;

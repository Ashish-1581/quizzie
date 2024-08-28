const express = require("express");
const router = express.Router();
const { createQna, getQnas, getQnaById,updateQna } = require("../controller/qna");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/createQna/:quizId",authMiddleware, createQna);
router.get("/getQnas", getQnas);
router.get("/getQna/:quizId", getQnaById);
router.patch("/updateQna/:quizId", updateQna);

module.exports = router;

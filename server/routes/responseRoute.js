const { createResponse, get_ResponseById } = require("../controller/response");

const router = require("express").Router();

router.post("/:quizId", createResponse);
router.get("/:quizId", get_ResponseById);

module.exports = router;

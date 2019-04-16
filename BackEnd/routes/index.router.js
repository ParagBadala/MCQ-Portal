const express = require('express');
const router = express.Router();

const ctrlQuestion = require('../controller/question.controller');
const ctrlUser = require('../controller/user.controller');
const ctrlCategory = require('../controller/categories.controller');

// const jwtHelper = require('../config/jwtHelper')

// router.post('/login',ctrlUser.authenticate);
// router.get('/get-question',jwtHelper.verifyJwtToken,ctrlQuestion.fetchQuestion);
// router.get('/get-question/:q_id',jwtHelper.verifyJwtToken,ctrlQuestion.fetchQuestionById);
// router.post('/post-question',jwtHelper.verifyJwtToken,ctrlQuestion.postQuestion);
// router.get('/get-question/:submitted_by',jwtHelper.verifyJwtToken,ctrlQuestion.getQuestionByUser)
router.delete('/delete/:_id',ctrlQuestion.deleteQuestion)
router.get('/get-user',ctrlUser.getUser);
router.get('/get-userGroup/:Uid',ctrlUser.getUserGroups);
router.post('/post-question',ctrlQuestion.postQuestion);
router.get('/get-question/:submitted_by',ctrlQuestion.getQuestionByUser);
router.patch('/update-question', ctrlQuestion.updateQuestion);
router.get('/get-allQuestion', ctrlQuestion.fetchAllQuestion);
router.get('/test-question', ctrlQuestion.testQuestion);
router.get('/next-question', ctrlQuestion.nextQuestion);
router.post('/add-cat',ctrlQuestion.addCategory);
router.get('/status-question', ctrlQuestion.fetchQuestionByStatus);
router.patch('/change-status', ctrlQuestion.changestatus);
router.get('/filterCategory', ctrlCategory.filterName);
router.post('/send-msg', ctrlUser.sendMsg);
router.get('/receive-msg/:Uid', ctrlUser.receiveMsg);

module.exports = router;
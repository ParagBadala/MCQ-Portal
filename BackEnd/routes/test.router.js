const express = require('express');
const router = express.Router();

const ctrlTest = require('../controller/test.controller');

router.get('/check',ctrlTest.checkDuplicate)
router.post('/post-test',ctrlTest.postTest);
router.get('/get-allTest/:Uid', ctrlTest.fetchTest);
router.get('/get-test-details/:id',ctrlTest.testDetails);
router.post('/submit', ctrlTest.submitResponse);
router.post('/save', ctrlTest.saveTest);
router.get('/result', ctrlTest.result);
router.get('/viewUserList/:tId', ctrlTest.viewParticipantList)

module.exports = router;
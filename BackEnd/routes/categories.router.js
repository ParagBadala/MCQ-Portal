const express = require('express');
const router = express.Router();

const ctrlCategory = require('../controller/categories.controller');

// const jwtHelper = require('../config/jwtHelper')

//router.get('get-categories',jwtHelper.verifyJwtToken,ctrlQuestion,ctrlQuestion.getCategories);
router.get('/get-categories',ctrlCategory.getCategories);

module.exports = router;
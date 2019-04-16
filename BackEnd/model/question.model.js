var mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question_id: {
        type: String
    },
    question_description: {
        type:String
    },
    options: [{
        type: String
    }],
    correct: [{
        type: String
    }],
    submitted_by: {
        type:String
    },
    approved_by: {
        type:String
    },
    q_type: {
        type:String
    },
    q_difficulty: {
        type:String
    },
    status: {
        type: String
    },
    category:{
        type: String
    }
});

module.exports = mongoose.model('question', questionSchema, 'mcqQuestion');

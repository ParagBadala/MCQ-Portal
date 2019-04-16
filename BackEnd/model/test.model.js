var mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    t_id: {
        type: String
    },
    t_name: {
        type:String
    },
    t_category: {
        type:String
    },
    t_level: {
        type:String
    },
    t_duration: {
        type:Number
    },
    total_question: {
        type:Number
    },
    created_by: {
        type:String
    },
    participants: [{
        type:Object
    }],
    status: {
        type: String
    },
    start_time: {
        type:Date
    }
});

module.exports = mongoose.model('test', testSchema, 'mcqTest');

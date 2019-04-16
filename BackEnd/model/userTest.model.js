var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: String
    },
    test_id: [{
        type:String
    }],
    response: [
        {
            test_id:{
                type:String
            },
            answers: [
                {
                    q_id: {
                        type:String
                    },
                    answer : [
                        {type:String}
                    ]
                }
            ],
            result: {
                type:Number
            }
        },


    ]
});

mongoose.model('userTest', userSchema, 'mcqUserTest');
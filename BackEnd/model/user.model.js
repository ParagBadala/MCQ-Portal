var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const userSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     uname: {
//         type: String
//     },
//     password: {
//         type:String
//     },
//     test_id: [{
//         type:String
//     }]
// });

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    empId: {
        type: String
    },
    myGroups: [{
        type: String
    }],
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type:String
    },
    status: {
        type: String
    }
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

mongoose.model('user', userSchema, 'users');

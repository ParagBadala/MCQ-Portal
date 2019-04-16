const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('user');

passport.use(
    new localStrategy({ usernameField: 'uname'}, (username,password,done) => {
        User.findOne({uname: username}, (err,user) => {
            if(err)
                return done(err);
            else if(!user){
                return done(null,false, {message: 'User not Authorized'});}
            else if(!user.verifyPassword(password))
                return done(null,false, {message: 'Wrong Password'});
            else
                return done(null,user);
        })
    } )
)
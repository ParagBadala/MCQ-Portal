const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true } ,(err)=>{
    if(!err) { console.log("Database Connection successful for ChapAppDb"); }
    else { console.log("Error in Database connection: "+ err); }
});

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true } ,(err)=>{
//     if(!err) { console.log("Database Connection successful for ChatApp "); }
//     else { console.log("Error in Database connection: "+ err); }
// });

require('./user.model');
require('./question.model');
require('./category.model');
require('./test.model');
require('./userTest.model');
require('./userGroup.model');

const mongoose = require('mongoose');
const test = mongoose.model('test');
const User = mongoose.model('user');
const UserTest = mongoose.model('userTest');
const Question = mongoose.model('question')
const qstnCtrl = require('./question.controller')

/**
 * Following module is used for checking duplicate test name
 */
module.exports.checkDuplicate = (req, res, next) => {
    test.find({"t_id": req.query.id},{"t_id":1, "_id":0}, (err,data) => {
        if(err){
            res.json("Failed to Check");
        }
        else {
            res.send(data)
        }
    })
}

/**
 * Following module is used for creating test
 */
module.exports.postTest = (req,res,next) => {
    console.log(req.body)
    let tempParticipants = req.body.participants;
    let participants = [];
    let userId = new Map();
    let newTest = new test();
    tempParticipants.forEach(user => {
        if(!userId.has(user.empId)){
          userId.set(user.empId, true);
          participants.push({
            'empId': user.empId,
            'name': user.name?user.name:user.firstName
          });
        }
      })
      console.log(participants);
    newTest._id = mongoose.Types.ObjectId();
    newTest.t_id = req.body.t_id;
    newTest.t_name = req.body.t_name;
    newTest.t_category = req.body.t_category;
    newTest.t_level = req.body.t_level;
    newTest.t_duration = req.body.t_duration;
    newTest.total_question = req.body.total_question;
    newTest.created_by = req.body.created_by;
    newTest.participants = participants;
    newTest.status = req.body.status;
    newTest.start_time = req.body.start_time
    addTestId(req.body.participants, newTest._id,res);
    newTest.save(err => {
        if(err) {
            // console.log(err)
            res.json("Failed to create test");
        }
        else{
            res.status(200).json({
                msg: 'Test Created and participants added'
            });
        }
    }); 
}

function addTestId(user,id,res) {
    for(let i=0; i<user.length; i++){
        let empId = user[i].empId
        console.log(UserTest.find({}).count() + "line 54")
        if(UserTest.find({}).count()){
            console.log("If")
            UserTest.find({"user_id":empId}, (err,data) => {
                if(!data || data.length === 0) {
                    createUser(empId, id,res)
                }
                else{
                    UserTest.findOneAndUpdate({"user_id":empId},{ $push: {
                        "test_id": id
                    }}, (err,data) => {
                        // console.log(data)
                    });
                }
                    });
        }
        else{
            console.log("Else")
            createUser(empId, id,res)
        }
        
            }
        }

function createUser(userId,testId,res) {
    console.log(userId)
    let newUser = new UserTest();
    newUser._id = mongoose.Types.ObjectId();
    newUser.user_id = userId;
    newUser.test_id = testId;
    newUser.save();
}

module.exports.fetchTest = (req, res, next) => {
    console.log(req.params.Uid)
    if(req.params.Uid == 'nothing'){
            res.json({
                msg: 'Log In First'
            })
    }
    else{
        UserTest.find({"user_id": req.params.Uid},{test_id:1, _id:0}, (err,data) => {
            // console.log(data)
            if(!data || data.length === 0) {
                res.json({
                    msg: 'No Test Available'
                })
            }
            else if(err) {
                res.json(err);
            }
            else{
                console.log(data[0].test_id)
               testInfo(data[0].test_id, res);   
            }
        })
    }
}

async function testInfo(data, res) {
    var info = [];
    for(var i=0; i<data.length; i++){
        testdata =await test.find({"_id":data[i]})
        info.push(testdata[0])
    }
    // console.log(info);
    res.send(info)
}

module.exports.testDetails = (req, res, next) => {
    test.find({"_id": req.params.id}, (err,data) => {
        if(err) {
            // console.log(err)
            res.json("err"); 
        }
        else if(!data || data.length === 0) {
            return res.status(200).json({
                msg: 'Test Not Found'
            });
        }                                                                                                                                                   
        else{
            // console.log(data)
            res.status(200).send(data);
        }
    })
}

module.exports.saveTest = (req, res, next) => {
    console.log(req.body)
    let response = req.body.response;
    let index = req.body.index;
    let sentQuestions = req.body.questions;
    let uid = req.body.uid;
    let tid = req.body.tid;
    // console.log(tid)
    let time_lapsed = req.body.time;
    let user = qstnCtrl.activeUser.find(user => user.user_id == uid);
    // console.log("132"+JSON.stringify(user))
    let test = user.tests.find(test => test.test_id == tid);
    // console.log("134"+JSON.stringify(test))
    test.savedResponse = response;
    test.index = index;
    test.sent_question = sentQuestions;
    test.time_lapsed = time_lapsed;   
    // console.log("139"+JSON.stringify(qstnCtrl.activeUser))
}

module.exports.submitResponse = (req, res, next) => {
    let counter = 0;
    let flag=0;
    let responseObj = req.body;
    UserTest.findOneAndUpdate({"user_id": req.body[0].user_id}, {$push : {response: req.body[1]}}).then(
        (result) => {
            UserTest.findOneAndUpdate({"user_id": req.body[0].user_id},{$pull : {"test_id": req.body[1].test_id}}, (err,data) => {
                if(err) {
                    // console.log(err)
                }
                else{
                    // console.log(data)
                }
            })
            test.findOneAndUpdate({"_id": req.body[1].test_id}, {$pull : {"participants": req.body[0].user_id}}, (err,data) => {
                if(err) {
                    // console.log(err)
                }
                else{
                    // console.log(data)
                }
            }
            )
            for(let i in qstnCtrl.activeUser) {
                if(req.body[0].user_id == qstnCtrl.activeUser[i].user_id) {
                    qstnCtrl.activeUser.splice(i,1);
                }
            }
            UserTest.find({"user_id": req.body[0].user_id, 'response':{$elemMatch:{'test_id':responseObj[1].test_id}}}, {'_id':0, 'response.$':1}, (err,data) => {
                // console.log(data[0]+"line204");
                // console.log(data[0].response+"line205")
                let resObj = data[0].response[0];
                // console.log(resObj);
                if(resObj['test_id'] == responseObj[1].test_id){
                    let answers = resObj['answers']
                    answers.forEach(answerObj=>{
                        if(answerObj !== null){
                            Question.find({'_id':answerObj.q_id}, (err,data)=>{
                                flag++;
                                console.log(data[0].correct[0] == answerObj.answer[0])
                                if(data[0].correct[0] == answerObj.answer[0]){
                                    counter++;
                                    console.log(counter+"line215")
                                }
                                console.log(flag, answers.length)
                            if(flag == answers.length){
                                console.log(counter+"line216")
                                console.log(req.body[0].user_id, responseObj[1].test_id);
                                UserTest.update({"user_id": req.body[0].user_id, 'response':{$elemMatch:{'test_id':responseObj[1].test_id}}},{$set:{'response.$.result':counter}}, (err, data) => {
                                    if(err) {
                                        console.log(err)
                                    }
                                    else{
                                        console.log(data)
                                    }
                                })
                            }
                            })
                        }
                        else{
                            flag++;
                            if(flag == answers.length){  
                            console.log(req.body[0].user_id, responseObj[1].test_id);
                            UserTest.update({"user_id": req.body[0].user_id, 'response':{$elemMatch:{'test_id':responseObj[1].test_id}}},{$set:{'response.$.result':counter}}, (err, data) => {
                                if(err) {
                                    console.log(err)
                                }
                                else{
                                    console.log(data)
                                }
                            })
                            }
                        }
                    })
                }
                
            })    
            res.status(200).send(result);
        }
    )
}

module.exports.result = (req,res,next) => {
    test.find({}, (err,data) => {
        if(!data || data.length === 0){
            res.status(201).json({
                msg:'No Result'
            })
        }
        else if(err){
            res.status(500).json({
                msg:'Server Error'
            })
        }
        else{
            console.log(data)
            res.status(200).send(data)
        }
        
    })
}

module.exports.viewParticipantList = (req,res,next) => {
    console.log(req.params)
    let testId = req.params.tId;
    UserTest.find({'response':{$elemMatch: {'test_id':testId}}}, {'_id':0, 'user_id':1, 'response.$':1}, (err,data) => {
        if(err){
            res.status(500).json({
                msg:'Server Error'
            })
        }
        else if(!data || data.length === 0){
            res.status(201).json({
                msg:'No Result'
            })
        }
        else{
            console.log(data + "line293")
            res.status(200).send(data)
        }
    })
}
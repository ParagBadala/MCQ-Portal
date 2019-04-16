const mongoose = require('mongoose');
const question = mongoose.model('question');
const category = mongoose.model('categories');
// let testQuest = [];
let activeUser = [];

module.exports.fetchQuestion = (req, res, next) => {
    question.find({}, (err, data) => {
        if (!data || data.length === 0) {
            return res.status(200).json({
                err: 'No Question exists'
            });
        }
        return res.json(data);
    })
}

module.exports.fetchQuestionById = (req, res, next) => {
    question.find({ question_id: req.params.q_id }, (err, data) => {
        if (!data || data.length === 0) {
            return res.status(404).json({
                err: 'Question Not Found'
            });
        }
        return res.json(data);
    })
}

module.exports.fetchQuestionByStatus = (req, res, next) => {
    question.find({ "status": "inactive" }, (err, data) => {
        if (err) {
            // console.log(err)
            res.send(err);
        }
        else if (!data || data.length === 0) {
            return res.status(204).json({
                err: 'Question Not Found'
            });
        }
        else {
            res.status(200).json(data)
        }
    })
}

module.exports.fetchAllQuestion = (req, res, next) => {
    question.find({}, (err, data) => {
        if (err) {
            // console.log(err)
            res.send(err);
        }
        else if (!data || data.length === 0) {
            return res.status(404).json({
                err: 'Question Not Found'
            });
        }
        else {
            res.status(200).json(data)
        }
    })
}

module.exports.postQuestion = (req, res, next) => {
    // console.log(req.body)
    let newQuestion = new question();
    newQuestion._id = mongoose.Types.ObjectId();
    newQuestion.question_id = req.body.question_id;
    newQuestion.question_description = req.body.question_description;
    newQuestion.options = req.body.options;
    newQuestion.correct = req.body.correct;
    newQuestion.submitted_by = req.body.submitted_by;
    newQuestion.approved_by = req.body.approved_by;
    newQuestion.q_type = req.body.q_type;
    newQuestion.q_difficulty = req.body.q_difficulty;
    newQuestion.status = req.body.status;
    newQuestion.category = req.body.category;
    // console.log(newQuestion)
    newQuestion.save(err => {
        if (err) {
            // console.log(err)
            res.json("Failed to add Question");
        }
        else {
            res.status(200).json(newQuestion)
        }
    });
}

module.exports.getQuestionByUser = (req, res, next) => {
    // console.log(req.params.submitted_by)
    question.find({ "submitted_by": req.params.submitted_by }, (err, data) => {
        // console.log(data)
        if (!data || data.length === 0) {
            return res.status(200).json({
                err: 'No Questions Found'
            });
        }
        return res.json(data);
    })
}

module.exports.updateQuestion = (req, res, next) => {
    question.findOneAndUpdate({ "_id": req.body._id }, {
        $set: {
            "question_description": req.body.question_description,
            "options": req.body.options,
            "correct": req.body.correct,
            "q_difficulty": req.body.q_difficulty
        }
    }, (err, data) => {
        if (err) {
            return res.status(200).json({
                err: 'Questions Not Updated'
            });
        }
        return res.status(200).json({
            msg: 'Questions Updated'
        });
    })
}

function enterQuestion(result, QuestCount = 0) {
    var check = [];
    let temp = [];
    // count++;
    len = result.length
    // console.log(len)
    while (len > -1 && QuestCount != 0) {
        i = generateRandom(result.length);
        if (!check.includes(i)) {
            check.push(i);
            // console.log(i)
            temp.push(result[i])
            len--;
            QuestCount--;
        }
        console.log(check)
        // console.log(temp)
    }
    // console.log("Before Return")
    return temp;
}

function mixedQuestion(level, totalQuestReq, lowCount, cat, res, mediumCount, hardCount, uid, tid, time, temp) {
    let tempQuestion = [];
    question.find({ "q_difficulty": level, "category": cat }, { _id: 1, question_description: 1, options: 1, q_type: 1, q_difficulty: 1 }).then(
        (result) => {
            if (level == "low") {
                tempQuestion = enterQuestion(result, lowCount);
                console.log(tempQuestion)
                for (let q of tempQuestion) {
                    temp.push(q)
                }
                console.log("low done")
                mixedQuestion("medium", totalQuestReq, lowCount, cat, res, mediumCount, hardCount, uid, tid, time, temp);
            }
            else if (level == "medium") {
                // console.log("Medium Questions")
                tempQuestion = enterQuestion(result, mediumCount);
                for (let q of tempQuestion) {
                    temp.push(q)
                }
                console.log("medium done")
                mixedQuestion("difficult", totalQuestReq, lowCount, cat, res, mediumCount, hardCount, uid, tid, time, temp);
            }
            else if (level == "difficult") {
                tempQuestion = enterQuestion(result, hardCount);
                for (let q of tempQuestion) {
                    temp.push(q)
                }
                console.log("difficult done")
                // console.log(temp)
                if (activeUser.filter(user => user.user_id == uid).length > 0) {
                    let user = activeUser.find(user => user.user_id == uid);
                    if (user.tests.filter(test => test.test_id == tid).length == 0) {
                        let obj = {
                            test_id: tid,
                            questions: temp,
                            savedResponse: [],
                            time_lapsed: time,
                            index: [],
                            sent_question: [],
                            status: "incomplete"
                        }

                        user.tests.push(obj);
                    }
                    else {
                        // let test = user.tests.find(test => test.test_id == tid);
                        // res.status(200).json({
                        //     index : test.index,
                        //     sent_question : test.sent_question,
                        //     time_lapsed : test.time_lapsed,
                        //     response : test.savedResponse,
                        //     progress : "continue"
                        // })
                    }

                }
                else {
                    let obj = {
                        user_id: uid,
                        tests: [
                            {
                                test_id: tid,
                                questions: temp,
                                savedResponse: [],
                                time_lapsed: time,
                                index: [],
                                sent_question: [],
                                status: "incomplete"
                            }
                        ]
                        // questions : temp,
                        // savedResponse : []
                    }
                    activeUser.push(obj);
                }
                // console.log(activeUser)
                let user = activeUser.find(user => user.user_id == uid);
                let test = user.tests.find(test => test.test_id == tid);
                // console.log(test)
                i = generateRandom(totalQuestReq);
                test.sent_question[0] = test.questions[i];
                test.savedResponse[0] = {
                    q_id: test.questions[i]._id,
                    answer: []
                }
                res.status(200).json({
                    startQuest: test.questions[i],
                    index: i
                })
            }
        }
    )

}

module.exports.testQuestion = async (req, res, next) => {
    let uid = req.query.uId
    let totalQuestReq = req.query.tNQ;
    let cat = req.query.category;
    let tid = req.query.tid;
    let time = req.query.time;
    let lowCount = Math.floor(totalQuestReq * (40 / 100));
    let mediumCount = Math.floor((totalQuestReq - lowCount) * (50 / 100));
    let hardCount = Math.floor(totalQuestReq - (lowCount + mediumCount))
    // console.log(activeUser);
    if (activeUser.filter(user => user.user_id == uid).length > 0) {
        // console.log("inside if")
        let user = activeUser.find(user => user.user_id == uid);
        if (user.tests.filter(test => test.test_id == tid)) {
            let test = user.tests.find(test => test.test_id == tid);

            res.status(200).json({
                index: test.index,
                sent_question: test.sent_question,
                time_lapsed: test.time_lapsed,
                response: test.savedResponse,
                progress: "continue"
            })
        }
    }
    else {
        if (req.query.level === 'mixed') {
            // console.log(tid)
            mixedQuestion('low', totalQuestReq, lowCount, cat, res, mediumCount, hardCount, uid, tid, time, [])
        }
        else {
            question.find({ "q_difficulty": req.query.level, "category": req.query.category }, { _id: 1, question_description: 1, options: 1, q_type: 1 }, (err, data) => {
                if (err) {
                    return res.status(404).json({
                        err: err
                    });
                }
                else if (!data || data.length === 0) {
                    return res.status(200).json({
                        err: 'No Questions Found'
                    });
                }
                else {
                    if (activeUser.filter(user => user.user_id == uid).length > 0) {
                        let obj = {
                            test_id: tid,
                            questions: data,
                            savedResponse: [],
                            time_lapsed: time,
                            index: [],
                            sent_question: [],
                            status: "incomplete"
                        }
                        let user = activeUser.find(user => user.user_id == uid);
                        user.tests.push(obj);
                    }
                    else {
                        let obj = {
                            user_id: uid,
                            tests: [
                                {
                                    test_id: tid,
                                    questions: data,
                                    savedResponse: [],
                                    time_lapsed: time,
                                    index: [],
                                    sent_question: [],
                                    status: "incomplete"
                                }
                            ]
                            // questions : temp,
                            // savedResponse : []
                        }
                        activeUser.push(obj);
                    }
                    // console.log(activeUser);
                    i = generateRandom(req.query.tNQ); 
                    let user = activeUser.find(user => user.user_id == uid);
                    let test = user.tests.find(test => test.test_id == tid)
                    test.sent_question[0] = test.questions[i];
                    test.savedResponse[0] = {
                        q_id: test.questions[i]._id,
                        answer: []
                    }
                    res.status(200).json({
                        startQuest: test.questions[i],
                        index: i
                    })
                }
            })
        }
    }
}

function generateRandom(max) {
    let i = Math.random();
    // console.log(max);
    return Math.floor(i * (max));
}

module.exports.nextQuestion = (req, res, next) => {
    let idx = req.query.num;
    let uid = req.query.user_id;
    let tid = req.query.test_id;
    let temp;
    let user = activeUser.find(user => user.user_id == uid);
    let test = user.tests.find(test => test.test_id == tid);
    temp = test.questions[idx];
    res.send(temp)
}

module.exports.changestatus = (req, res, next) => { 
    // console.log(req.body)
    let id = req.body.q_id;
    let status = req.body.status
    question.findOneAndUpdate({ "_id": id }, { "status": status }, (err, data) => {
        if (err) {
            res.send(err)
        }
        else {
            res.status(200).json({
                message: `Question ${id} is active now`
            });
        }
    }
    )
}

module.exports.addCategory = (req, res, next) => {
    category.update({ $push: { "category": req.body.cat } }, (err, data) => {
        if (err) {
            res.send(err)
        }
        else {
            res.send(data);
        }
    })
}

module.exports.deleteQuestion = (req, res, next) => {
    question.find({ "_id": req.params._id }).remove((err, data) => {
        if (data) res.status(200).json({
            message: `Question ${req.params._id} deleted`
        });
        else if (!data || data.length === 0) {
            res.status(200).json({
                err: 'No Questions Found'
            });
        }
        else if (err)
            console.log(err);
    })
}

module.exports.activeUser = activeUser;

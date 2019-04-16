const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('user');
const Group = mongoose.model('group');
let chatStorage = []

module.exports.authenticate = (req,res,next) => {
    // call for passport authentication
    passport.authenticate('local', (err,user, info) => {
        // err from passport middleware
        if(err) return res.status(400).json(err);
        // registered user
        else if(user) return res.status(200).json({"token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info)
    })(req,res)
}

module.exports.getUser = (req, res, next) => {
    User.find({},{"_id":1,"firstName":1, "lastName":1, "empId":1, "myGroups": 1}, (err,data) => {
        if(!data || data.length === 0) {
            return res.status(201).json({
                err: 'No User exists'
            });
        }
        else if(err){
            return res.status(404).json({
                err: err
            })
        }
        else{
            console.log(data)
            return res.status(200).send(data);
        }
    });
}

module.exports.getUserGroups = (req, res, next) => {
    let Uid = req.params.Uid
    let groupDetails = []
    User.find({"empId": Uid},{"myGroups":1, "_id": 0}).exec().then((data) => {
        if(!data || data.length === 0) {
            return res.status(200).json({
                err: 'No Groups exists'
            });
        }
        else{
            let groups = data[0].myGroups
            let count = groups.length
            console.log(count)
            groups.forEach (group => {
                Group.find({"groupName": group},{"groupName": 1, "groupMembers": 1, "_id": 0}).exec().then(data => {
                    groupDetails.push(data[0])
                    console.log(count)
                    if(count === 1){
                        return res.send(groupDetails);
                    }
                    count--;
                })
                .catch()
            })
        }
    })
    .catch()
}

module.exports.sendMsg = (req,res,next) => {
    let Obj = req.body;
    console.log(Obj) 
    User.find({"empId":Obj.sender},{"_id":0,"firstName":1, "lastName":1}, (err,data) => {
        if(!data || data.length === 0) {
            return res.status(404).json({
                err: 'Server Error'
            }); 
        }
        else if(err){
            return res.status(404).json({
                err: err 
            })
        }
        else{
            // if(chatStorage.length){
            //     chatStorage.forEach(item => {
            //         console.log(item + "line81")
            //         if(item.sender == Obj.sender){
            //             item['msgObj'].push(Obj.msgObj[0])
            //         }
            //         else{
            //             Obj['name'] = data[0].firstName+' '+data[0].lastName 
            //             chatStorage.push(Obj)
            //         }
            //     })
            // }
            // else{
            //     Obj['name'] = data[0].firstName+' '+data[0].lastName 
            //     chatStorage.push(Obj)
            // }
            Obj['name'] = data[0].firstName+' '+data[0].lastName 
            chatStorage.push(Obj)
            console.log(chatStorage)
            res.status(200).json({msg:'send'})
        }
    });
}

// module.exports.sendMsg = (req,res,next) => {
//     let Obj = req.body;
//     User.find({"empId":Obj.user},{"_id":0,"firstName":1, "lastName":1}, (err,data) => {
//         if(!data || data.length === 0) {
//             return res.status(404).json({
//                 err: 'Server Error'
//             });
//         }
//         else if(err){
//             return res.status(404).json({
//                 err: err
//             })
//         }
//         else{
//             if(chatStorage.length){
//                 chatStorage.forEach(item => {
//                     console.log(item + "line81")
//                     if(item.user == Obj.sender){
//                         let id = 'Sender'+crypto.randomBytes(16).toString("hex");
//                         let object = {
//                             'timestamp': Obj.timestamp,
//                             'msgId': id
//                         }
//                         item['send'].push(Obj.msgObj[0])
//                     }
//                     else{
//                         Obj['name'] = data[0].firstName+' '+data[0].lastName 
//                         chatStorage.push(Obj)
//                     }
//                 })
//             }
//             else{
//                 Obj['name'] = data[0].firstName+' '+data[0].lastName 
//                 chatStorage.push(Obj)
//             }
//             console.log(chatStorage)
//             res.status(200).json({msg:'send'})
//         }
//     }); 
// }


module.exports.receiveMsg = (req,res,next) => {
    let uid = req.params.Uid
    console.log(uid)
    let chatCollection = [];
    chatStorage.forEach(chatObj => {
        if(chatObj.sender == uid || chatObj.receiver == uid){
            chatCollection.push(chatObj)
        }
    })
     res.status(200).send(chatCollection);
}
 
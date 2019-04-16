var mongoose = require('mongoose');

const userGroupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    groupMembers: [{
            type: Object
        }],
    groupName: {
        type: String
    },
    groupCreatedById: {
        type: String
    },
    groupCreatedByName: {
        type: String
    }    
});

mongoose.model('group', userGroupSchema, 'groups');
var mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: [{
        type: String
    }],
});

module.exports = mongoose.model('categories', testSchema, 'mcqcategories');
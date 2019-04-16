const mongoose = require('mongoose');
const category = mongoose.model('categories');

/**
 * Following module is used for fetching Categories
 */
module.exports.getCategories = (req,res,next) => {
    category.find({}, (err,data) => {
        if(!data || data.length === 0) {
            return res.status(404).json({
                err: 'No Category exists'
            });
        }
        else if(err){
            return res.status(404).json({
                err: 'Server Error'
            });
        }
        else{
        return res.json(data);
        }
    })
}

/**
 * Following module is used for creating dynamic filters
 */
module.exports.filterName = (req,res,next) => {
    let filterObj = [];
    filterObj.push(addLevel());
   addCategory(filterObj,res);
}

/**
 * following function adding level object in filterObj
 */
function addLevel() {
    let Obj = {
        "type": "q_difficulty",
        "label": "Level",
        "value": [
            {
                "label":"low",
                "checked":false
            },
            {
                "label":"medium",
                "checked":false
            },
            {
                "label":"difficult",
                "checked":false
            }
        ]
    }
    return Obj
}

/**
 * following function adding catgeories object in filterObj
 * @param {filterObj} filterObj 
 * @param {res} res
 */
function addCategory(filterObj,res) {
    let Obj = {
        "type": "category",
        "label": "Category",
        "value": []
    }
    filterObj.push(Obj)
    category.find({}, (err,data) => {
        if(!data || data.length === 0) {
            return 
        }
        let count = data[0].category.length
                while(count--){
                    let tempObj = {
                        "label" : data[0].category[count],
                        "checked":false
                    }
                    Obj["value"].push(tempObj)
                }
        return res.status(200).send(filterObj)
    })
} 
const jwt = require('jsonwebtoken');

/** Function for Verification of Token  */
module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    console.log(req.headers['authorization']);
    if('authorization' in req.headers)
        console.log(req.headers['authorization'])
        token = req.headers['authorization'].split(" ")[1];
    if(!token){
        console.log(token)
        return res.status(403).send({auth:false, message: 'No token provided.'});}
    else{
        jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
            if(err)
                return res.status(500).send({auth:false, message: 'Token authentication failed.'});
            else
                req._id = decoded._id;
                next();
        })
    }
}
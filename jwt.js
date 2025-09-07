const jwt = require('jsonwebtoken')
require('dotenv').config();

const jwtAuthMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error:'token not found'});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'unauthorised'});

    try{
       const decoded= jwt.verify(token,process.env.JWT_SECRET);
       req.user=decoded;
       next();
    }
    catch(err){
        res.status(401).json({error:'INVALID TOKEN'});
    }
}
const generateToken = (userData)=>{
return jwt.sign(userData,process.env.JWT_SECRET);
}
module.exports = {jwtAuthMiddleware,generateToken};
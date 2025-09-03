const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({quiet: true});

const isAuthenticated = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"unauthorized"});
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"unauthorized"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }
    catch(err){
        next(err);
    }
}

module.exports = isAuthenticated;
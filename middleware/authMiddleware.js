const JWT = require('jsonwebtoken');
const user = require('../models/user');

// creating middleware to check token exist or not
const isSignrequired = (req , res , next)=>{
    try {
        const decode =  JWT.verify(req.headers.authorization , process.env.SECRETKEY); // decode: {"_id": "65171beed6561ad5c94780d0","iat": 1696088544,"exp": 1696693344} decode consist this sort of object
        req.user = decode; // we will run the isadmin middleware just after this and there we will use this req.user object to get the user id
        next();
        
    } catch (error) {
        res.send({
            message :"error in isSignrequired middleware",
            error
        })
    }
   
}

// creating middleware to check whether the user is admin or not

const isAdmin = async(req , res , next)=>{
    try {
        const id = req.user._id;
        const findUser = await user.findById({_id : id});
        if(findUser){
            if(findUser.role){
                
                res.send({message : "user is admin" })
            }else{
                
                res.send({message : "user is not admin"})
            }
        }
    } catch (error) {
        res.send({
            message : "eror in isadmin middleware",
            error : error
        })
    }
    
}

module.exports = {isSignrequired , isAdmin};
const user = require('../models/user');
const admin = require('../models/admin')
const order = require('../models/order');
const authHelper = require('../helpers/authHelper');
const hashPassword = authHelper.hashPassword;
const comparePasswords = authHelper.comparePasswords;
const jwt = require('jsonwebtoken');

// route for registeration
const registerControler = async(req , res)=>{
    try {
        const {name , email, password , phone , address } = await req.body;
        if(!name || !email || !phone || !address || !password){
            return res.send({"success" :false , "message" : "fill the form feilds properly"});
        }

        // checking whether user exist or not
        const userExist = await user.findOne({email});
        if(userExist){
            return res.send({"success" :false ,"message" : "user already exist plz go for login"})
        }

        // hashig password 
        const hashedPassword = await hashPassword(password);


        // creating new user
        const newUser = new user({name , email ,password:hashedPassword , phone , address , role : 0});
        await newUser.save()
        return res.send({"success" :true ,"message" : "registered successfuly"});
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "success" :false ,
            "message" : "error in register page",
            error
        })
    }
}

// route for login 
const loginControler = async(req , res)=>{
    const{email , password} = req.body;
    if(!email || !password){
        return res.status(200).send({
            success : false,
            message : "invalid credentials"
        })
    }

    // checking whethr user exist with this email id or not
    const userExist = await user.findOne({email});
    
    if(!userExist){
        return res.status(200).send({
            success : false,
            message : "user with email id doesnot exist, please first register yourself"
        })
    }

    // comparing password
    const authUser = await comparePasswords(password , userExist.password);
    // creatinng jsonwebtoken 
    const token = await jwt.sign({_id : userExist._id }, process.env.SECRETKEY , {expiresIn : "7d",}); // jsonwebtoken created
    
    if(authUser){
        return res.status(200).send({
            success : true,
            message : "user login successfully",
            token : token,
            userDetailes : userExist
        })
    }else{
        return res.status(200).send({
            success :false,
            message : "invalid credentials"
        })
    }

}

// test
const testControler = (req , res)=>{
    res.send({message : "protected user"});
}

// admin registration
const adminRegisterControler = async(req , res)=>{
    try {
        const {name , email, password , phone , address } = await req.body;
        if(!name || !email || !phone || !address || !password){
            return res.send({"success" :false , "message" : "fill the form feilds properly"});
        }

        // checking whether user exist or not
        const userExist = await admin.findOne({email});
        if(userExist){
            return res.send({"success" :false ,"message" : "user already exist plz go for login"})
        }

        // hashig password 
        const hashedPassword = await hashPassword(password);


        // creating new user
        const newUser = new admin({name , email ,password:hashedPassword , phone , address });
        await newUser.save()
        return res.send({"success" :true ,"message" : "registered successfuly"});
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "success" :false ,
            "message" : "error in register page",
            error
        })
    }
}
// route for admin login
const adminloginControler = async(req , res)=>{
    const{email , password} = req.body;
    if(!email || !password){
        return res.status(200).send({
            success : false,
            message : "invalid credentials"
        })
    }

    // checking whethr user exist with this email id or not
    const userExist = await admin.findOne({email});
    
    if(!userExist){
        return res.status(200).send({
            success : false,
            message : "admin with email id doesnot exist, please first register yourself"
        })
    }

    // comparing password
    const authUser = await comparePasswords(password , userExist.password);
    // creatinng jsonwebtoken 
    const token = await jwt.sign({_id : userExist._id }, process.env.SECRETKEY , {expiresIn : "7d",}); // jsonwebtoken created
    
    if(authUser){
        return res.status(200).send({
            success : true,
            message : "admin login successfully",
            token : token,
            userDetailes : userExist
        })
    }else{
        return res.status(200).send({
            success :false,
            message : "invalid credentials"
        })
    }

} 

// route to update profile of user
const updateProfile =async(req , res)=>{
    try {
        const {_id ,name , email, password , phone , address} = req.body;
        const updateProf = await user.findByIdAndUpdate(_id , {name , email, password : await hashPassword(password) , phone , address });
        if(updateProf){
            return res.status(200).send({message : "profile updated successfuly" , success : true , updateProf});
        }else{
            return res.status(500).send({message : "profile not updated successfuly" , success : false});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "success" :false ,
            "message" : "error in update profile page",
            error
        })
    }
}

// route to get all order list which are ordered 
const orderProfile = async(req ,res)=>{
    try {
        const id = req.user._id;
        const orderlst = await order.find({"buyer" : id}).populate("products" , '-image').populate("buyer");
        if(orderlst){
            console.log(orderlst);
            return res.status(200).send({message : "order list" , success : true , orderlst})
        }else{
            console.log("no order places yet");
            return res.status(500).send({success : false , message :"no order list"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "success" :false ,
            "message" : "error in order profile page",
            error
        })
    }
}


module.exports = {registerControler ,loginControler ,testControler ,adminRegisterControler ,adminloginControler , updateProfile , orderProfile};

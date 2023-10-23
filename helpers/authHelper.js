const bcrypt = require('bcrypt');

// function to hash the password
const hashPassword = async(password)=>{
    try {
        const saltRounds = 10;
        const hashedPasswrd = await bcrypt.hash(password , saltRounds);
        return hashedPasswrd;
    } catch (error) {
        console.log(error);
    }
}

// function to compare or decrypt the hashed password
const comparePasswords = async(password , hPasswod)=>await bcrypt.compare(password , hPasswod);


module.exports ={hashPassword , comparePasswords}

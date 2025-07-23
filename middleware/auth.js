const Users = require("../models/userModel");
const jwt = require('jsonwebtoken');

const SECRET_KEY=process.env.SECRET_KEY;

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization');
        
        const getUser = jwt.verify(token, SECRET_KEY);
        
        const user = await Users.findByPk(getUser.UserId);
        
        if (user) {
            req.user=user;
            next();
        } else {
            console.log('error in authorization');
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({success: false, message: "cant authenticate user"});
    }
}

module.exports= auth;
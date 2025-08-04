const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const getUser = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(getUser.UserId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.role !== "admin") {
      return res.status(403).send("Access denied- User is not admin");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("error in finding user status");
  }
};

module.exports = checkAdmin;

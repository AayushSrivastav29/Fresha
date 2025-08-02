const User = require("../models/userModel");

const checkAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
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

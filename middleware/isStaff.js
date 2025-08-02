const User = require("../models/userModel");
module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.role !== "staff") {
      return res.status(403).send("Access denied- User is not staff");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("error in finding user status");
  }
};

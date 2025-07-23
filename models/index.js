const ForgotPasswordRequests = require("./forgotPasswordModel");
const Users = require("./userModel");

//one to many
Users.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(Users);

module.exports={
    Users,
    ForgotPasswordRequests
}
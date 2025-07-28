const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("customer", "admin", "staff"),
    defaultValue: "customer",
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = User;

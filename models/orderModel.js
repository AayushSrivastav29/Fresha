const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Order = sequelize.define("Order", {
  orderId: { type: DataTypes.STRING, primaryKey: true },
  userId: DataTypes.INTEGER,
  email: DataTypes.STRING,
  status: DataTypes.STRING, // pending, success, failed
  serviceId: DataTypes.INTEGER,
  staffId: DataTypes.INTEGER,
  date: DataTypes.DATEONLY,
  startTime: DataTypes.STRING,
});

module.exports = Order;

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  staffId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  status: {
    type: DataTypes.ENUM("confirmed", "cancelled", "rescheduled"),
    defaultValue: "confirmed",
  },
});

module.exports = Appointment;

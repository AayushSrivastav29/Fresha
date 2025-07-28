const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const StaffAvailability = sequelize.define("StaffAvailability", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.ENUM(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = StaffAvailability;

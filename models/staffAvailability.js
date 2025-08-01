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
    type: DataTypes.TEXT,
    get() {
      return this.getDataValue("dayOfWeek")?.split(",") || [];
    },
    set(val) {
      this.setDataValue("dayOfWeek", val.join(","));
    },
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

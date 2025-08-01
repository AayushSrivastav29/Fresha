const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const ServiceAvailability = sequelize.define("ServiceAvailability", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
module.exports = ServiceAvailability;

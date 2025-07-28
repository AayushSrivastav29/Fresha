const {DataTypes}=require('sequelize');
const sequelize= require('../utils/db-connection');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  staffReply: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports=Review;
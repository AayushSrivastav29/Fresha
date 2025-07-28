const Service = require("./serviceModel");
const ServiceAvailability = require("./serviceAvailabilty");
const Staff = require("./staffModel");
const StaffAvailability = require("./staffAvailability");
const Appointment = require("./appointmentModel");
const User = require("./userModel");
const Review = require("./reviewModel");
const Order = require("./orderModel");
Service.hasMany(ServiceAvailability);
ServiceAvailability.belongsTo(Service);

User.hasOne(Staff, { foreignKey: "userId", onDelete: "CASCADE" });
Staff.belongsTo(User, { foreignKey: "userId" });

Staff.belongsToMany(Service, { through: "StaffServices" });
Service.belongsToMany(Staff, { through: "StaffServices" });

Staff.hasMany(StaffAvailability, {
  foreignKey: {
    name: "staffId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  as: "availability",
});

StaffAvailability.belongsTo(Staff, {
  foreignKey: {
    name: "staffId",
    allowNull: false,
  },
});

Appointment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Appointment, { foreignKey: "userId", onDelete: "CASCADE" });

Appointment.belongsTo(Staff, { foreignKey: "staffId" });
Staff.hasMany(Appointment, { foreignKey: "staffId" });

Appointment.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(Appointment, { foreignKey: "serviceId" });

Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });

Review.belongsTo(Appointment, { foreignKey: "appointmentId" });
Appointment.hasOne(Review, {
  foreignKey: "appointmentId",
  onDelete: "CASCADE",
});

Review.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(Review, { foreignKey: "serviceId", onDelete: "CASCADE" });

Review.belongsTo(Staff, { foreignKey: "staffId" });
Staff.hasMany(Review, { foreignKey: "staffId", onDelete: "CASCADE" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Staff.hasMany(Review, { foreignKey: "staffId", onDelete: "CASCADE" });
Review.belongsTo(Staff, { foreignKey: "staffId" });


module.exports = {
  Service,
  ServiceAvailability,
  Staff,
  StaffAvailability,
  Appointment,
  Review,
  Order,
};

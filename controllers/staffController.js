const bcrypt = require("bcrypt");
const Staff = require("../models/staffModel");
const Service = require("../models/serviceModel");
const User = require("../models/userModel");
const StaffAvailability = require("../models/staffAvailability");
const ServiceAvailability = require("../models/serviceAvailabilty");
const sequelize = require("../utils/db-connection");

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: Service,
          attributes: ["id", "name", "description", "duration", "price"],
          through: { attributes: [] },
        },
        {
          model: StaffAvailability,
          as: "availability",
        },
        {
          model: User,
        },
      ],
    });
    res.status(200).json({
      message: "Staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};
const addStaff = async (req, res) => {
  try {
    let { name, email, phone, gender, password, bio, specializations } =
      req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }
    if (!name || !email || !phone || !gender || !password || !specializations) {
      return res
        .status(400)
        .send("Name, email, password and specializations are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      gender,
      password: hashedPassword,
      role: "staff",
    });
    const newStaff = await Staff.create({
      userId: user.id,
      bio,
      specializations,
    });

    res.status(201).json({
      message: "Staff added successfully",
      staff: newStaff,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Staff cant be added ",
      success: false,
    });
  }
};
const getAll = async (req, res) => {
  try {
    const staffList = await Staff.findAll({
      include: [
        {
          model: Service,
          attributes: ["id", "name", "description", "duration", "price"],
          through: { attributes: [] },
        },
        {
          model: StaffAvailability,
          as: "availability",
        },
        {
          model: User,
        },
      ],
    });
    res.status(200).json({
      message: "Staffs fetched successfully",
      staff: staffList,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      success: false,
    });
  }
};
const updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    let { name, email, phone, gender, password, bio, specializations } =
      req.body;

    const staff = await Staff.findByPk(staffId, { include: User });
    if (!staff) {
      return res.status(404).send("staff not found");
    }
    // Update related User
    await staff.User.update({
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      password: password,
      bio: bio,
      specializations: specializations,
    });

    await staff.save();

    res.status(200).json({
      message: "Staff updated successfully",
      staff,
    });
  } catch (err) {
    console.error("Update staff error:", err);
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const assignServicesToStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { serviceIds } = req.body; // [1, 2, 3]

    const staff = await Staff.findByPk(staffId, {
      include: { model: StaffAvailability, as: "availability" },
    });
    if (!staff) {
      return res.status(404).send("staff not found");
    }

    const services = await Service.findAll({
      where: { id: serviceIds },
      include: ServiceAvailability,
    });

    const validServiceIds = [];

    const staffDays = staff.availability.map((avail) => avail.dayOfWeek).flat(); // Flatten arrays of days from each availability entry

    for (const service of services) {
      const isSkillMatch = Array.isArray(staff.specializations)
        ? staff.specializations.includes(service.name)
        : false;

      const serviceDays =
        service.ServiceAvailabilities?.flatMap((sa) => sa.dayOfWeek) || [];

      const commonDays = staffDays.filter((day) => serviceDays.includes(day));

      if (isSkillMatch && commonDays.length > 0) {
        validServiceIds.push(service.id);
      }
    }

    if (validServiceIds.length === 0) {
      res
        .status(400)
        .send("No valid services match staff's skill and schedule.");
    }

    await staff.setServices(validServiceIds);

    res.status(200).json({
      message:
        "Services successfully assigned based on skill and availability match.",
      staffId,
      assignedServices: validServiceIds,
    });
  } catch (error) {
    console.error("Error assigning services to staff:", error);
    res.status(500).send("Internal Server Error during service assignment");
  }
};

const removeStaff = async (req, res) => {
  let transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id, { transaction });

    if (!staff) {
      return res.status(404).send("Staff not found");
    }

    await StaffAvailability.destroy({
      where: { staffId: id },
      transaction,
    });

    await User.destroy({
      where: { id: staff.userId },
      transaction,
    });

    await staff.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({
      message: "Staff deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getById,
  addStaff,
  getAll,
  updateStaff,
  assignServicesToStaff,
  removeStaff,
};

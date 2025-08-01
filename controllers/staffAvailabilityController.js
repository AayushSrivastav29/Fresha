const { Staff, StaffAvailability } = require("../models");
const { literal } = require("sequelize");

const setAvailabilityForStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { dayOfWeek, startTime, endTime } = req.body; // e.g. ["Monday","Wednesday"], "09:00", "17:00"

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).send("Staff not found");
    }

    const newAvailability = await StaffAvailability.create({
      dayOfWeek,
      startTime,
      endTime,
      staffId,
    });

    res.status(201).json({
      message: "Availability set successfully",
      data: newAvailability,
    });
  } catch (err) {
    console.error("Set availability error:", err);
    res.status(500).send("Failed to set availability");
  }
};

const getAvailabilityForStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findByPk(staffId, {
      include: [
        {
          model: StaffAvailability,
          as: "availability",
          separate: true,
          order: [
            literal(
              `FIELD(dayOfWeek, 'monday','tuesday','wednesday','thursday','friday','saturday','sunday')`
            ),
          ],
        },
      ],
    });

    if (!staff) {
      return res.status(404).send("Staff not found");
    }

    res.status(200).json({
      staffId: staff.id,
      name: staff.name,
      availability: staff.availability,
    });
  } catch (err) {
    console.error("Get availability error:", err);
    res.status(500).send("Failed to fetch availability");
  }
};

const updateAvailabilitySlot = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    const slot = await StaffAvailability.findByPk(availabilityId);
    if (!slot) {
      return res.status(404).send("Availability slot not found");
    }

    await slot.update({
      dayOfWeek: dayOfWeek ?? slot.dayOfWeek,
      startTime: startTime ?? slot.startTime,
      endTime: endTime ?? slot.endTime,
    });

    res.status(200).json({
      message: "Availability slot updated successfully",
      slot,
    });
  } catch (err) {
    console.error("Update availability error:", err);
    res.status(500).send("Failed to update availability slot");
  }
};

const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const slot = await StaffAvailability.findByPk(availabilityId);
    if (!slot) {
      return res.status(404).send("Availability slot not found");
    }

    await slot.destroy();
    res.status(200).json({
      message: "Availability slot deleted successfully",
      slotId: availabilityId,
    });
  } catch (err) {
    console.error("Delete availability error:", err);
    res.status(500).send("Failed to delete availability slot");
  }
};

module.exports = {
  setAvailabilityForStaff,
  getAvailabilityForStaff,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
};

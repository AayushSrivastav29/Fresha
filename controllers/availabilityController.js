const { ServiceAvailability } = require("../models");

const setAvailability = async (req, res) => {
  try {
    const { ServiceId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    const availability = await ServiceAvailability.create({
      dayOfWeek,
      startTime,
      endTime,
      ServiceId:ServiceId
    });
    res
      .status(201)
      .json({
        message: "Availability set successfully",
        data: availability,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Availability not set",
        error: error.message,
        success: false,
      });
  }
};

const getAvailability = async (req, res) => {
  try {
    const ServiceId = req.params.id;
    const availability = await ServiceAvailability.findAll({
      where: {
        ServiceId: ServiceId,
      },
    });
    res.status(200).json({ data: availability, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "cant get availability by service-id",
        error: error.message,
        success: false,
      });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const slotId = req.params.id;
    const { dayOfWeek, startTime, endTime } = req.body;
    const slot = await ServiceAvailability.findByPk(slotId);
    if (!slot) res.status(404).send('Slot not found');

    await slot.update(
      dayOfWeek,
      startTime,
      endTime
    );
    res.status(201).json({ message: "Availability updated", slot });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "cant update availability by slot-id",
        error: error.message,
        success: false,
      });
  }
};

const deleteAvailability=async(req, res) => {
      try {
        const slotId = req.params.id;
        const availability = await ServiceAvailability.findByPk(slotId);

       await availability.destroy();

       res.status(200).json({ message: 'Availability slot deleted' });
    } catch (error) {
      console.log(error);
    res
      .status(500)
      .json({
        message: "cant delete availability by slot-id",
        error: error.message,
        success: false,
      });
    }
}

module.exports={
  setAvailability,updateAvailability,deleteAvailability,getAvailability
}
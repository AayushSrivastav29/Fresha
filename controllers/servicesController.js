const { Service, ServiceAvailability } = require("../models");

const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    const service = await Service.create({
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
    });

    res.status(201).json(service);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await Service.update(updates, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    const updatedService = await Service.findByPk(id);
    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    await ServiceAvailability.destroy({
      where: { ServiceId: id },
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports={
  createService,
  updateService,
  deleteService,
  getAllServices,
  getServiceById
}

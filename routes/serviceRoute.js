const servicesController=require('../controllers/servicesController');
const availabilityController=require('../controllers/availabilityController');
const express=require('express');
const router=express.Router();
const isAdmin=require('../middleware/isAdmin');

router.get('/',servicesController.getAllServices);
router.get('/:id',servicesController.getServiceById);
router.post('/create',servicesController.createService);
router.put('/update/:id',servicesController.updateService);
router.delete('/delete/:id',servicesController.deleteService);
router.post('/set-avail/:id',availabilityController.setAvailability);
router.get('/get-avail/:id',availabilityController.getAvailability);

module.exports=router;
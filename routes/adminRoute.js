const express=require('express');
const router=express.Router();
const userController = require("../controllers/userController");
const appointmentController = require('../controllers/appointmentController');
const isAdmin = require('../middleware/isAdmin');

router.get('/customers',isAdmin, userController.getAllCustomers);
router.put('/customer/update/:id',isAdmin, userController.updateUser);
router.delete('/customer/delete/:id',isAdmin, userController.deleteUser);
//
router.post('/avail-slots',isAdmin, appointmentController.getAvailableSlots);
router.get('/',isAdmin,appointmentController.getAllAppointments);
router.put('/reschedule/:id',isAdmin , appointmentController.rescheduleAppointment);
router.delete('/cancel/:id',isAdmin,appointmentController.cancelAppointment);


module.exports=router;
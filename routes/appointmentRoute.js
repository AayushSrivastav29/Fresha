const express=require('express');
const router=express.Router();
const appointmentController=require('../controllers/appointmentController');

router.post('/avail-slots',appointmentController.getAvailableSlots);
router.post('/book',appointmentController.bookAppointment);
router.post('/validate',appointmentController.validateBeforePayment);
router.get('/getmy/:userId',appointmentController.getMyAppointments);
router.get('/',appointmentController.getAllAppointments);
router.put('/reschedule/:id', appointmentController.rescheduleAppointment);
router.delete('/cancel/:id',appointmentController.cancelAppointment);
module.exports=router;
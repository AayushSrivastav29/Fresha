const express=require('express');
const router=express.Router();
const appointmentController=require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.post('/avail-slots',appointmentController.getAvailableSlots);
router.post('/book',appointmentController.bookAppointment);
router.post('/validate',appointmentController.validateBeforePayment);
router.get('/getmy', auth,appointmentController.getMyAppointments);
router.get('/',appointmentController.getAllAppointments);
router.put('/reschedule/:id', appointmentController.rescheduleAppointment);
router.delete('/cancel/:id',auth, appointmentController.cancelAppointment);
module.exports=router;
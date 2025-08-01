const express=require('express');
const router=express.Router();
const isAdmin=require('../middleware/isAdmin');
const staffController=require('../controllers/staffController');
const staffAvailabilityController=require('../controllers/staffAvailabilityController');


router.get('/',staffController.getAll);
router.post('/add' ,staffController.addStaff);
router.get('/:id',staffController.getById);
router.put('/update/:id' ,staffController.updateStaff);
router.delete('/remove/:id' ,staffController.removeStaff);
//
router.post('/set-avail/:id' ,staffAvailabilityController.setAvailabilityForStaff);
router.get('/get-avail/:id' ,staffAvailabilityController.getAvailabilityForStaff);
router.put('/update-avail/:availabilityId' ,staffAvailabilityController.updateAvailabilitySlot);
router.delete('/delete-avail/:availabilityId' ,staffAvailabilityController.deleteAvailabilitySlot);
router.post('/assign-service/:id' ,staffController.assignServicesToStaff);

module.exports=router;
const express=require('express');
const router=express.Router();
const paymentController=require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/', paymentController.getPaymentPage)
router.post('/pay',auth,paymentController.processPayment);
router.get('/status/:orderId',paymentController.getPaymentStatus);


module.exports=router;
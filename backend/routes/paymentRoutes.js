const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');

// Create Razorpay order
router.post('/create-order', createPaymentOrder);

// Verify payment
router.post('/verify', verifyPayment);

module.exports = router; 
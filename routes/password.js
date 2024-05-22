const express = require('express');
const router = express.Router();

const passowrdController = require('../controllers/password');

router.post('/forgotpassword', passowrdController.resetPassword);

module.exports = router;
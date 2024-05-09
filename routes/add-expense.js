const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/add-expense');

router.post('/add-expense', expenseController.postExpense);
router.get('/get-expense', expenseController.getExpense);
router.delete('/delete-expense/:Id', expenseController.deleteExpense);

module.exports = router;
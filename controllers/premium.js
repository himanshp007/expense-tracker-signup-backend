const Expense = require("../models/add-expense");
const User = require('../models/user');



exports.showLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll();

        const expensePromises = users.map(async (user) => {
            const expenses = await user.getExpenses();
            const totalExpense = expenses.reduce((total, expense) => total + +expense.amount, 0);
            return { id: user.id, name: user.name, total: totalExpense };
        });

        const expenseArr = await Promise.all(expensePromises);

        expenseArr.sort((a, b) => b.total - a.total);

        res.status(200).json({ result: expenseArr });
    } catch (err) {
        console.log(err);
        res.status(404).json({ result: err });
    }
};

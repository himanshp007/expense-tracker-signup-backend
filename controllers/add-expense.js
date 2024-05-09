const Expense = require("../models/add-expense");

exports.postExpense = async (req, res, next) => {
    try {

        if (!req.body.amount) {
            throw new Error ("Please Add Amount Before proceeding");
        };

        const {amount, description, category} = req.body;

        await Expense.create({
            amount:amount,
            description: description,
            category: category
        })
        .then(response => res.status(200).json({message: "Expense Added Successfully!"}))
        .cat
    } catch (err){
        res.status(500).json({message: "Something went wrong"});
    }
};


exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({result: expenses});
    } catch (err){
        res.status(500).json({message: "Something went wrong"});
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.Id;

        await Expense.destroy({
            where: {
              id: expenseId
            },
          })
        .then(result => {
            res.status(200).json({message: "Deleted Successfully"});
        })
    }catch (err) {
        res.status(500).json({error : err.message});
    };
};
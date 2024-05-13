const Expense = require("../models/add-expense");

exports.postExpense = async (req, res, next) => {
    try {

        if (!req.body.amount) {
            throw new Error ("Please Add Amount Before proceeding");
        };

        const {amount, description, category} = req.body;

        await req.user.createExpense({
            amount:amount,
            description: description,
            category: category
        })
        .then(response => res.status(200).json({message: "Expense Added Successfully!"}))
        .catch(err => console.log(err));
    } catch (err){
        res.status(500).json({message: "Something went wrong"});
    }
};


exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        res.status(200).json({ result: expenses });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// exports.deleteExpense = async (req, res, next) => {
//     try {
//         const expenseId = req.params.Id;

//         await Expense.destroy({
//             where: {
//               id: expenseId
//             },
//           })
//         .then(result => {
//             res.status(200).json({message: "Deleted Successfully"});
//         })
//     }catch (err) {
//         res.status(500).json({error : err.message});
//     };
// };

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.Id;

        // Assuming you have properly defined the association between User and Expense
        await Expense.destroy({
            where: {
                id: expenseId,
                userId: req.user.id // Ensure that the expense belongs to the authenticated user
            }
        });

        res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
};

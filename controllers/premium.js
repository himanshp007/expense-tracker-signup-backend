const sequelize = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/add-expense');



exports.showLeaderboard = async (req, res, next) => {
    try {
        const leaderboardDetails = await User.findAll({
            attributes: [
                'id', 
                'name', 
                [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalexpense'] 
            ],
            include: [
                {
                    model: Expense, 
                    attributes: [] 
                }
            ],
            group: ['user.id'],
            order: sequelize.literal('totalexpense DESC')
        });

        res.status(200).json({ result: leaderboardDetails });
    } catch (err) {
        console.log(err);
        res.status(404).json({ result: err });
    }
};

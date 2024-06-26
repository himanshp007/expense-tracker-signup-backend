const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    paymentid : Sequelize.STRING,
    orderid : Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = Order;
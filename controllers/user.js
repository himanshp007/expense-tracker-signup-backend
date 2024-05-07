const User = require('../models/user');

exports.postUser = async (req, res, next) => {

    try{

        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error("All fields are mandatory");
        }
        const {name, email, password} = req.body;

        await User.create({
            name: name,
            email: email,
            password: password
        })
        .then(response => res.status(200).json({ message: 'User added successfully!' }))
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
    
};
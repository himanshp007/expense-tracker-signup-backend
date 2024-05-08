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

exports.postLoginUser = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("All fields are mandatory");
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'User logged in successfully!' });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

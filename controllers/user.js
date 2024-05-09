
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postUser = async (req, res, next) => {

    try{

        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error("All fields are mandatory");
        }
        const {name, email, password} = req.body;

        const user = await User.findOne({where: {email: email}})

        if (user) {
            return res.status(404).json({message: "Email already registered"})
        };

        const saltRounds = 10;
        await bcrypt.hash(password, saltRounds, function(err, hash) {

            console.log(err);

            User.create({
                name: name,
                email: email,
                password: hash
            })
            .then(response => res.status(200).json({ message: 'User added successfully!' }))
        })

    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
    
};


exports.postLoginUser = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error("Email and password are required fields");
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }


        bcrypt.compare(password, user.password, function(err, result) {
            if (!result) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
            res.status(200).json({ message: 'User logged in successfully!' });
        })

        
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

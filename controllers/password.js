
const nodemailer = require("nodemailer");
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPasswordRequests = require('../models/ForgotPasswordRequests');



exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Receiver\'s email is required' });
    }

    try {

        const user = await User.findOne({where:{email: email}})
        ForgotPasswordRequests.create({
            id: uuidv4(),
            isActive: true,
            userId: user.id
        }).then(response => {

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  user: process.env.NODEMAILER_USER,
                  pass: process.env.NODEMAILER_PASS,
                },
              });
              
              async function main() {

                const info = await transporter.sendMail({
                  from: process.env.NODEMAILER_USER,
                  to: email,
                  subject: "Password Reset", 
                  html: `<p>Here is the link to reset your password: <a href="http://localhost:3000/password/resetpassword/${response.id}">Reset Password</a></p>`
                });
              
                console.log("Message sent: %s", info.messageId);
              }
              
              main().catch(console.error);
            
    
            res.status(200).json({ message: 'Password reset email sent successfully' });
        })
        
    } catch (error) {
        console.error('Error sending transactional email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};


exports.verifyingResetLink = async (req, res) => {

    try{
        const requestId = req.params.requestId;

        const validateReq = await ForgotPasswordRequests.findOne({where: {id: requestId}});

        if (!validateReq) {
            return res.status(404).json({ error: "Invalid request ID" });
        }

        if (!validateReq.isActive) {
            return res.status(400).json({ error: "Link already expired" });
        }

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
        </head>
        <body>
            <h1>Reset Password</h1>
            <form action="/password/verifypassword/${requestId}" method="POST">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
                <br>
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
                <br>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
        `);
    }catch (err) {
        res.status(500).json({ error: error.message });
    }

}


exports.finalizingReset = async (req, res) => {

    try {
        const requestId = req.params.requestId;

        const {newPassword, confirmPassword} = req.body;

        console.log(newPassword, confirmPassword)

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Password do not match' });
        }

        const passwordReq = await ForgotPasswordRequests.findOne({where:{id: requestId}})

        const user = await User.findOne({where:{id:passwordReq.userId}})

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        passwordReq.isActive = false;
        await passwordReq.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}















// const Sib = require('sib-api-v3-sdk');
// require('dotenv').config();

// exports.resetPassword = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: 'Receiver\'s email is required' });
//     }

//     try {
//         const client = Sib.ApiClient.instance;

//         const apiKey = client.authentications['api-key'];
//         apiKey.apiKey = process.env.EMAIL_API_KEY;

//         if (!apiKey.apiKey) {
//             return res.status(500).json({ message: 'API key not found' });
//         }

//         const tranEmailApi = new Sib.TransactionalEmailsApi();

//         const sender = {
//             email: 'kartikaryan004@gmail.com',
//             name: 'Himansh'
//         };

//         const receivers = [
//             {
//                 email: email,

//             }
//         ];

//         await tranEmailApi.sendTransacEmail({
//             sender,
//             to: receivers,
//             subject: 'Password Reset',
//             textContent: 'Here is the link to reset your password: [Reset Password Link]', 
//             htmlContent: '<p>Here is the link to reset your password: <a href="[Reset Password Link]">Reset Password</a></p>'
//         });

//         res.status(200).json({ message: 'Password reset email sent successfully' });
//     } catch (error) {
//         console.error('Error sending transactional email:', error);
//         res.status(500).json({ message: 'Failed to send email' });
//     }
// };



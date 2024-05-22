const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Receiver\'s email is required' });
    }

    try {
        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.EMAIL_API_KEY;

        if (!apiKey.apiKey) {
            return res.status(500).json({ message: 'API key not found' });
        }

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'kartikaryan004@gmail.com',
            name: 'Himansh'
        };

        const receivers = [
            {
                email: email,

            }
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Password Reset',
            textContent: 'Here is the link to reset your password: [Reset Password Link]', 
            htmlContent: '<p>Here is the link to reset your password: <a href="[Reset Password Link]">Reset Password</a></p>'
        });

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending transactional email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

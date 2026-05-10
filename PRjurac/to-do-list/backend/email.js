const nodemailer = require('nodemailer');

// Настройка SMTP-сервера 
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});


function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
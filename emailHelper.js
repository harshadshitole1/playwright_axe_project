const nodemailer = require('nodemailer');
const path = require('path');

async function sendReportEmail(to, subject, text, attachments = []) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: attachments.map(file => ({
      filename: path.basename(file),
      path: file
    }))
  });

  console.log("📧 Reports emailed successfully!");
}

module.exports = { sendReportEmail };
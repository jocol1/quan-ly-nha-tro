const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

app.post('/send-email', (req, res) => {
  const { email, file, filename } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lytanloc10c1@gmail.com',
      pass: 'lytanloclytanloc',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: `Hóa đơn thanh toán - Phòng ${filename.split('_')[2].split('.')[0]}`,
    text: 'Kèm theo là hóa đơn của bạn.',
    attachments: [
      {
        filename: filename,
        content: Buffer.from(file),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Lỗi gửi email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email gửi thành công');
    }
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
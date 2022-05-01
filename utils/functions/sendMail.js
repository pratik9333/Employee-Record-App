const nodemailer = require("nodemailer");

exports.sendMail = (receiver, mailbody, subject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "konarkdossiers@gmail.com",
      pass: process.env.MAIL_APP_PASSWORD,
    },
    secure: false,
  });
  transporter
    .sendMail({
      from: '"Employee Records App konarkdossiers@gmail.com', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: mailbody, // html body
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
  transporter.verify().then(console.log).catch(console.error);
};

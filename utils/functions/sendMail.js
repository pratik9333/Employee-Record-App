const nodemailer = require("nodemailer");

exports.sendMail = (receiver, mailbody, subject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "pratikaswani9333@gmail.com",
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });
  transporter
    .sendMail({
      from: '"Employee Records App pratikaswani9333@gmail.com', // sender address
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

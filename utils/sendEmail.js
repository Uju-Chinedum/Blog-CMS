const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });

  return transporter.sendMail({
    from: '"Blog CMS" <ujuchimaraoke@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

const nodemailer = require('nodemailer');

const config = require(`${global.__appRoot}lib/config`);

const Mailer = {
  // 메일발송 함수
  async send(param, isHtml = false) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: config.email.smtpHost,
      port: Number(config.email.smtpPost),
      secure: true,
      requireTLS: true,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
    });

    // 메일 옵션
    const mailOptions = {
      from: config.email.smtpFrom,
      to: param.to, // 수신할 이메일
      subject: param.subject, // 메일 제목
    };

    // 메일 내용
    if (isHtml) {
      mailOptions.html = param.text;
    } else {
      mailOptions.text = param.text;
    }

    // 메일 발송
    return transporter.sendMail(mailOptions);
  },
};

module.exports = Mailer;

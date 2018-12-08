const send_email = require('@sendgrid/mail');
send_email.setApiKey(process.env.SENDGRID_API_KEY);

const SEND_MAIL = (to, from, subject, html) => {

    const msg = {
        to: to,
        from : from,
        subject: subject,
        html: html
    }

    send_email.send(msg);
  

}



exports = SEND_MAIL;


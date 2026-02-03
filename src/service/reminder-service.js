const transport = require('../config/email-config');

const sendGmail = async (mailFrom, mailTo, mailSubject, mailBody) => {

    try {
        const mail = await transport.sendMail({
        from: mailFrom,
        to: mailTo,
        subject: mailSubject,
        text: mailBody
    })
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    sendGmail
}
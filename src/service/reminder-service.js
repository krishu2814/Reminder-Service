const transport = require('../config/email-config');

const sendGmail = async (mailFrom, mailTo, mailSubject, mailBody) => {

    try {
        // Sends an email using the preselected transport object
        const mail = await transport.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        });
        return mail;
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    sendGmail
}
/**
 * from: -> can be random email (no need to be real)
 */
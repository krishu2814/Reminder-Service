const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('./serverConfig');

// createTransport -> use to send mails
const transport = nodemailer.createTransport({
    service: 'Gmail',
    // use -> user and pass only as attributes name
    auth: {
        user: EMAIL,
        pass: PASS
    }
})

module.exports = transport;
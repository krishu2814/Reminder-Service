const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('./serverConfig');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        EMAIL_ID: EMAIL,
        EMAIL_PASS: PASS
    }
})

module.exports = transport;
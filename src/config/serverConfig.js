const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    PASS: process.env.PASS,
    EMAIL: process.env.EMAIL,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    QUEUE_NAME: process.env.QUEUE_NAME,
}
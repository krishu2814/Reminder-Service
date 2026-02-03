const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    PASS: process.env.PASS,
    EMAIL: process.env.EMAIL
}
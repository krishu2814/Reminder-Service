const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('../src/config/serverConfig');
const { sendGmail } = require('./service/reminder-service');

const startServer = function () {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, () => {
        console.log(`Server is listening at the port ${PORT}`);
        // console.log(sendGmail());
        sendGmail(
            'support@admin.com',
            'krishukumarsingh06@gmail.com',
            'this is a testing mail.',
            'Hey, how are you Krishu.'
        )
    });
}

startServer();
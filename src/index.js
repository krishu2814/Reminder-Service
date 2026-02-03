const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('../src/config/serverConfig');
// const { sendGmail } = require('./service/reminder-service');

const startServer = function () {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // listening at port
    app.listen(PORT, () => {
        console.log(`Server is listening at the port ${PORT}`);
    //     sendGmail(
    //     'abc@gmail.com',
    //     'projectbanaegare@gmail.com',
    //     'Just testing email',
    //     'Chlne laga✅'
    // )
    });
}

startServer();
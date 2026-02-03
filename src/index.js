const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('../src/config/serverConfig');

const startServer = function () {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, () => {
        console.log(`Server is listening at the port ${PORT}`)
    })
}

startServer();
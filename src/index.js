const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('../src/config/serverConfig');
const TicketController = require('./controllers/ticket-controller');
const jobs = require('./utils/job');
const cron = require('node-cron');

const startServer = function () {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/api/v1/tickets', TicketController.create);
    
    app.listen(PORT, () => {
        console.log(`Server is listening at the port ${PORT}`);
        jobs();

        // cron schedule
        cron.schedule('*/1 * * * *', () => {
            console.log('running a task every two minutes');
        });
    });
}

startServer();
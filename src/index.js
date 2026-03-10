const express = require('express');
const bodyParser = require('body-parser');
const { PORT, REMINDER_BINDING_KEY } = require('../src/config/serverConfig');
const { sendReminder } = require('./services/email-service'); 
const { createChannel, subscribeMessage } = require('./utils/message-queue');
const TicketController = require('./controllers/ticket-controller');
const jobs = require('./utils/job');

const startServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const channel = await createChannel();

    // subscribe to booking event
    await subscribeMessage(channel, sendReminder, REMINDER_BINDING_KEY);

    app.post('/api/v1/tickets', TicketController.create);
    
    app.listen(PORT, () => {
        console.log(`Server is listening at the port ${PORT}`);

        // calling setupJobs() internally which will sendMail() to recipient email for reminder
        jobs(); /* IMPORTANT */
    });
};

startServer();
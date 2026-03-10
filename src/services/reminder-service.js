const { createChannel, subscribeMessage } = require('./utils/message-queue');
const { sendReminder} = require('./services/email-service');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');

const startReminderService = async () => {
    try {
        const channel = await createChannel();

        // subscribe to the queue for reminders
        // service -> sendReminder
        await subscribeMessage(channel, sendReminder, REMINDER_BINDING_KEY);

        console.log("Reminder Service is listening to RabbitMQ...");
    } catch (error) {
        console.log("Error starting Reminder Service:", error);
    }
};

startReminderService();
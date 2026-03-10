const sender = require('../config/email-Config');
const TicketRepository = require('../repository/ticket-repository');

const repo = new TicketRepository();

/**
 * Sends a basic email using the configured mail transporter.
 * 
 * @param {string} mailFrom - Sender email address
 * @param {string} mailTo - Recipient email address
 * @param {string} mailSubject - Email subject
 * @param {string} mailBody - Email content
 */
const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody) => {
    try {
        const response = await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        });

        console.log('Email sent successfully:', response);
        return response;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


/**
 * Fetch all pending notification tickets.
 * These represent emails that are scheduled but not yet sent.
 * 
 * @param {Date} timestamp - Optional filter for notification time
 */
const fetchPendingEmails = async (timestamp) => {
    try {
        const response = await repo.get({ status: "PENDING" });
        return response;

    } catch (error) {
        console.error('Error fetching pending emails:', error);
        throw error;
    }
};


/**
 * Update the status or fields of a notification ticket.
 * 
 * @param {number} ticketId
 * @param {Object} data
 */
const updateTicket = async (ticketId, data) => {
    try {
        const response = await repo.update(ticketId, data);
        return response;

    } catch (error) {
        console.error('Error updating ticket:', error);
        throw error;
    }
};


/**
 * Create a notification ticket in the database.
 * 
 * Ticket lifecycle example:
 * PENDING  -> SUCCESS
 * PENDING  -> FAILED
 */
const createNotification = async (data) => {
    try {
        console.log('Creating notification ticket:', data);

        const response = await repo.create(data);
        return response;

    } catch (error) {
        console.error('Error creating notification ticket:', error);
        throw error;
    }
};


/**
 * Main reminder handler.
 * 
 * This function is triggered when a message is received from RabbitMQ.
 * It performs the following steps:
 * 
 * 1. Extract booking information
 * 2. Create a notification ticket
 * 3. Send email confirmation
 * 4. Update ticket status after successful delivery
 */
const sendReminder = async (message) => {
    try {
        console.log('Received message for reminder service:', message);

        const booking = message.data;

        // Validate message format
        if (!booking || !booking.userEmail) {
            console.warn('Invalid booking data. Email cannot be sent.');
            return;
        }

        /**
         * Step 1: Create notification ticket
         */
        const ticket = await createNotification({
            subject: "Flight Confirmation",
            content: `Your booking ${booking.bookingId} is confirmed.`,
            recepientEmail: booking.userEmail,
            status: "PENDING",
            notificationTime: new Date()
        });

        /**
         * Step 2: Send confirmation email
         */
        await sendBasicEmail(
            "support@airline.com",
            booking.userEmail,
            "Booking Confirmation",
            `Hello! Your booking ID ${booking.bookingId} for flight ${booking.flightId} is successful.`
        );

        /**
         * Step 3: Update ticket status after successful email delivery
         */
        await updateTicket(ticket.id, { status: "SUCCESS" });

        console.log(`Ticket ${ticket.id} processed successfully.`);

    } catch (error) {
        console.error('Error in reminder service:', error);
    }
};

/**
 * Event dispatcher for RabbitMQ messages
 * This allows handling multiple event types
 */
const subscribeEvents = async (payload) => {

    const { service, data } = payload;

    switch(service) {

        case 'CREATE_TICKET':
            await createNotification(data);
            break;

        case 'SEND_BASIC_MAIL':
            await sendBasicEmail(
                data.from,
                data.to,
                data.subject,
                data.body
            );
            break;

        case 'SEND_REMINDER':
            await sendReminder(data);
            break;

        default:
            console.log('No valid event received');
    }
};



module.exports = {
    sendBasicEmail,
    fetchPendingEmails,
    createNotification,
    updateTicket,
    sendReminder,
    subscribeEvents
};
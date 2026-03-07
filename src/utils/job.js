const cron = require('node-cron');
const emailService = require('../services/email-service');
const sender = require('../config/email-Config');

/**
 * 10:00 am 
 * Every 5 minutes
 * We will check are their any pending emails which was expected to be sent 
 * by now  and is pending
 * setupJobs() is being called in index.js file
 */

/**
 * We can set up mutliple cron schedule based on priorities💯 and status✅
 */

const setupJobs = () => {
    cron.schedule('*/2 * * * *', async () => {

        // fetch emails with pending reminder
        const response = await emailService.fetchPendingEmails();
        console.log(response);

        // since NotificationTicket is an array so we need to iterate       
        response.forEach((email) => {

            // sendMail({},()) from email-service.js
            sender.sendMail({
                to: email.recepientEmail,
                subject: email.subject,
                text: email.content
            },
                
            // another parameter that sendMail() has✅
                async (err, data) => {
                    // first parameter is error
                    // second parameter is data
                if(err) {
                    console.log(err);
                } else {
                    console.log(data);
                    // if not error -> after sending notification/reminder -> update the status
                    await emailService.updateTicket(email.id, {status: "SUCCESS"});
                }
            });
        });
        console.log(response);
    });    
}

module.exports = setupJobs;
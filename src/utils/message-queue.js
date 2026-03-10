const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME } = require('../config/serverConfig');

/**
 * Cached RabbitMQ connection.
 * This ensures that the application does not create multiple connections,
 * which can lead to socket exhaustion and performance issues.
 */
let connection;

/**
 * Creates a RabbitMQ channel.
 * 
 * Flow:
 * 1. Establish connection to RabbitMQ (if not already connected)
 * 2. Create a channel
 * 3. Ensure the exchange exists -> assertExchange()
 * 
 * Exchange is declared as durable so it survives RabbitMQ restarts.
 */
const createChannel = async () => {
    try {
        // if connection does not exists
        if (!connection) {
            connection = await amqplib.connect(MESSAGE_BROKER_URL);
        }

        const channel = await connection.createChannel();

        // Ensure exchange exists before publishing or consuming messages
        await channel.assertExchange(EXCHANGE_NAME, 'direct', {
            durable: true
        });

        return channel;

    } catch (error) {
        console.error('Error while creating RabbitMQ channel:', error);
        throw error;
    }
};

/**
 * Subscribes to messages from RabbitMQ.
 * 
 * Steps:
 * 1. Ensure queue exists -> assertQueue()
 * 2. Bind queue to exchange with routing key -> bindQueue()
 * 3. Consume messages from the queue -> consume()
 * 4. Process message using the provided service function
 * 5. Acknowledge message after successful processing
 */
const subscribeMessage = async (channel, service, bindingKey) => {
    try {
        // Ensure the queue exists
        const queue = await channel.assertQueue(QUEUE_NAME, {
            durable: true
        });

        // Bind queue to exchange using routing key
        await channel.bindQueue(queue.queue, EXCHANGE_NAME, bindingKey);

        // Start consuming messages
        channel.consume(queue.queue, async (msg) => {

            if (!msg || !msg.content || msg.content.length === 0) {
                console.warn('Received empty message. Skipping processing.');
                return;
            }

            try {
                const contentString = msg.content.toString();
                console.log('Received message:', contentString);

                const data = JSON.parse(contentString);

                // Execute business logic passed as service
                await service(data);

                // Acknowledge message after successful processing
                channel.ack(msg);

            } catch (error) {
                console.error('Message processing failed:', error);

                /**
                 * Negative acknowledgement
                 * 
                 * false -> do not requeue the message
                 * This prevents infinite retry loops for malformed messages
                 */
                channel.nack(msg, false, false);
            }

        });

    } catch (error) {
        console.error('Error while subscribing to messages:', error);
        throw error;
    }
};

/**
 * Publishes a message to RabbitMQ exchange.
 * 
 * Steps:
 * 1. Convert message to JSON string
 * 2. Convert JSON string to buffer
 * 3. Publish message to exchange with routing key -> publish()
 * 
 * persistent: true ensures message survives RabbitMQ restarts
 * if the queue is durable.
 */
const publishMessage = async (channel, bindingKey, message) => {
    try {
        if (!message || Object.keys(message).length === 0) {
            console.warn('Attempted to publish an empty message. Skipping.');
            return;
        }

        const bufferMessage = Buffer.from(JSON.stringify(message));

        channel.publish(
            EXCHANGE_NAME,
            bindingKey,
            bufferMessage,
            {
                persistent: true
            }
        );

        console.log('Message published successfully:', message);

    } catch (error) {
        console.error('Error while publishing message:', error);
        throw error;
    }
};

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
};

/* 

Your Node Service
       │
       │ TCP
       ▼
RabbitMQ Server

TCP Connection
     │
     ├── Channel 1
     ├── Channel 2
     └── Channel 3
 * This variable stores the created channel.
 * This function initializes RabbitMQ connection when the service starts.
 * This creates a TCP connection between your microservice and RabbitMQ server. -> MESSAGE_BROKER_URL
 *     
*/
/*
////////////////////////////////////////////////////////////////////////////////////
API Gateway
     │
     ├── Flight Service
     ├── Search Service
     ├── Booking Service
     │        │
     │        │ publish message
     │        ▼
     │     RabbitMQ
     │        │
     │        ▼
     └── Notification Service
              │
              ▼
          Send Email

////////////////////////////////////////////////////////////////////////////////////
User books flight
        │
        ▼
Booking Service
        │
publish booking.created
        │
        ▼
RabbitMQ Exchange
        │
        ▼
notification_queue
        │
        ▼
Notification Service
        │
        ▼
    Send Email
*/


const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { Client } = require('whatsapp-web.js');

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Define an async function to handle the message event
const handleMessage = async (message) => {
    console.log('Pesan masuk!');
    console.log('Nomor : ' + message.from + "\n" + 'Chat : ' + message.body);
    console.log('========================');

    if (message.body === '!hello') {
        message.reply('Hello!');
    }

    try {
        await axios.post('https://webhook.site/92dcf6d1-ac5c-4b4c-bb27-f5b3a794a9bd', {
            message: message.body,
            sender: message.from,
            timestamp: message.timestamp,
            // Add any other data you want to send
        });
        console.log('Message data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending message data to webhook:', error);
    }
};

// Attach the handleMessage function to the 'message' event
client.on('message', handleMessage);

client.initialize();

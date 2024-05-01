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
        const response = await axios.post('http://127.0.0.1:8000/api/whatsapp/save', {
            whatsapp: message.from,
            token: message.body
        });
        console.log('Message data sent to local API successfully');
        console.log('API Response:', response.data);
        if (response.data.message === "Token verified successfully") {
            message.reply('Token verified successfully, Whatsapp Saved');
        }
    } catch (error) {
        console.error('Error sending message data to local API:', error);
    }
};

// Attach the handleMessage function to the 'message' event
client.on('message', handleMessage);

client.initialize();

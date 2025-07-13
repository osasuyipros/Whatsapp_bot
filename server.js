// server.js (Node.js backend for Telegram login approval)

const express = require('express'); const bodyParser = require('body-parser'); const axios = require('axios'); const app = express(); const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '8096107981:AAF4QDZy7Lp73VKkHh_aXscCg6GuaLvn6oM'; const TELEGRAM_API_URL = https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN};

app.use(bodyParser.json());

// In-memory store for status const approvalStatus = {}; // { '2341234567890': 'approved' | 'denied' }

// Telegram webhook endpoint app.post('/webhook', async (req, res) => { const update = req.body;

if (update.callback_query) { const callback = update.callback_query; const chatId = callback.message.chat.id; const data = callback.data; const number = data.split('_')[1];

if (data.startsWith('approve_')) {
  approvalStatus[number] = 'approved';

  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: `✅ Login successfully approved for number: ${number}`
  });

} else if (data.startsWith('deny_')) {
  approvalStatus[number] = 'denied';

  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: `❌ Login denied for number: ${number}`
  });
}

// Respond to Telegram to remove loading spinner
axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
  callback_query_id: callback.id
});

}

res.sendStatus(200); });

// Endpoint for frontend to check status app.get('/check-status', (req, res) => { const number = req.query.number; const status = approvalStatus[number] || 'pending'; res.json({ status }); });

app.listen(PORT, () => { console.log(Server running on port ${PORT}); });


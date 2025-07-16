const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Chaves de API
const GEMINI_API_KEY = 'AIzaSyALRPcGnpMXZolY5QvcxUrVP1MiCjMQgQQ';
const ULTRAMSG_INSTANCE_ID = 'instance132670';
const ULTRAMSG_TOKEN = 'rq1kbm9vv09dw7s5';

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.message?.body;
  const sender = req.body.message?.from;

  if (!message) return res.sendStatus(200);

  try {
    // Envia a mensagem para a IA Gemini
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      }
    );

    const respostaGemini = geminiResponse.data.candidates[0].content.parts[0].text;

    // Envia a resposta para o WhatsApp via Ultramsg
    await axios.get(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      params: {
        token: ULTRAMSG_TOKEN,
        to: sender,
        body: respostaGemini
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro:', error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

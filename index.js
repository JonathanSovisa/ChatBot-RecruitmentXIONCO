const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.static('public'));

// test route
app.get('/', (req, res) => {
  res.send('Server jalan');
});

// CHAT AI (GROQ - GRATIS)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: 'Pesan kosong' });
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah chatbot AI yang ramah, santai, dan membantu mahasiswa.'
            },
            { role: 'user', content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      'AI tidak merespons';

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

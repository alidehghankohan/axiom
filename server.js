const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// چک سلامت سرور
app.get('/', (req, res) => {
  res.send('AXIOM سرور فعاله ✅');
});

// آدرسی که index.html بهش پیام میفرسته
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'پیام خالیه' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'تو AXIOM هستی، دستیار هوش مصنوعی شخصی علی دهقان‌کهن. علی رو "داش علی" صدا میزنی. فارسی حرف میزنی، صادق و صریح و بلندپروازی.',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.content[0].text;
    res.json({ reply });

  } catch (error) {
    console.error('خطا:', error);
    res.status(500).json({ error: 'یه مشکلی پیش اومد، دوباره امتحان کن' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AXIOM روی پورت ${PORT} روشن شد`);
});
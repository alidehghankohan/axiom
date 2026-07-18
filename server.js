const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

app.get('/', (req, res) => {
  res.send('AXIOM سرور فعاله ✅');
});

app.post('/api/chat', async (req, res) => {
  console.log('یه درخواست جدید رسید:', req.body);

  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'پیام خالیه' });
    }

    if (!process.env.CLAUDE_API_KEY) {
      console.log('خطا: کلید API تنظیم نشده!');
      return res.status(500).json({ error: 'کلید API تنظیم نشده' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'تو AXIOM هستی، دستیار هوش مصنوعی شخصی علی دهقان‌کهن. علی رو "داش علی" صدا میزنی. فارسی حرف میزنی، صادق و صریح و بلندپروازی.',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.content[0].text;
    console.log('جواب کلود آماده شد ✅');
    res.json({ reply });

  } catch (error) {
    console.log('خطای کامل:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AXIOM روی پورت ${PORT} روشن شد`);
});
import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a website content generator.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });
    const text = response.choices?.[0]?.message?.content ?? '';
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

export default router;

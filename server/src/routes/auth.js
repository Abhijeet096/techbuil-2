import { Router } from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import { signJwt } from '../utils/auth.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, name, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ email, name, passwordHash });
  const token = signJwt({ userId: user._id, email: user.email, name: user.name });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ userId: user._id, email: user.email, name: user.name });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
});

router.post('/logout', async (_req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;

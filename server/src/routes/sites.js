import { Router } from 'express';
import { z } from 'zod';
import Site from '../models/Site.js';
import { requireAuth } from '../utils/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const sites = await Site.find({ ownerId: req.user.userId }).sort({ updatedAt: -1 });
  res.json({ sites });
});

const createSchema = z.object({ name: z.string().min(1) });
router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name } = parsed.data;
  const site = await Site.create({ ownerId: req.user.userId, name, pages: [] });
  res.json({ site });
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  theme: z.record(z.any()).optional(),
  pages: z.array(z.any()).optional(),
});

router.put('/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const site = await Site.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.userId },
    { $set: parsed.data },
    { new: true }
  );
  if (!site) return res.status(404).json({ error: 'Not found' });
  res.json({ site });
});

router.delete('/:id', async (req, res) => {
  const result = await Site.deleteOne({ _id: req.params.id, ownerId: req.user.userId });
  res.json({ ok: result.deletedCount === 1 });
});

export default router;

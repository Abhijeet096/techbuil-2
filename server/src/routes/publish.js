import { Router } from 'express';
import { nanoid } from 'nanoid';
import Site from '../models/Site.js';
import { requireAuth } from '../utils/auth.js';

const router = Router();

router.post('/:id', requireAuth, async (req, res) => {
  const site = await Site.findOne({ _id: req.params.id, ownerId: req.user.userId });
  if (!site) return res.status(404).json({ error: 'Not found' });
  if (!site.publishSlug) site.publishSlug = nanoid(10);
  site.publishedAt = new Date();
  await site.save();
  res.json({ slug: site.publishSlug, url: `/p/${site.publishSlug}` });
});

router.get('/p/:slug', async (req, res) => {
  const site = await Site.findOne({ publishSlug: req.params.slug });
  if (!site) return res.status(404).json({ error: 'Not found' });
  res.json({ site });
});

export default router;

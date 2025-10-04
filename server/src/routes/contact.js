import { Router } from 'express';
import nodemailer from 'nodemailer';
import Site from '../models/Site.js';

const router = Router();

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, auth: { user, pass } });
}

router.post('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { email, name, message } = req.body ?? {};
  if (!email || !message) return res.status(400).json({ error: 'Missing email or message' });
  const site = await Site.findOne({ publishSlug: slug }).populate('ownerId');
  if (!site) return res.status(404).json({ error: 'Site not found' });
  const to = site.ownerId?.email;
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';

  const transporter = createTransporter();
  const mail = {
    from,
    to: to || from,
    replyTo: email,
    subject: `New inquiry for ${site.name}`,
    text: `From: ${name || 'Anonymous'} <${email}>
Site: ${site.name} (/p/${slug})

${message}`,
  };

  try {
    if (transporter) {
      await transporter.sendMail(mail);
    } else {
      console.log('Email not configured. Mail content:', mail);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;

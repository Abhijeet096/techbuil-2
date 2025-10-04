import jwt from 'jsonwebtoken';

export function signJwt(payload, options = {}) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d', ...options });
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const decoded = verifyJwt(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });
  req.user = decoded;
  next();
}

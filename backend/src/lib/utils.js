import jwt from 'jsonwebtoken';
export const generateToken = (userId, res) => {
  const token = jwt.sign(userId, process.env.JWT_SECRET, {
    expireIn: '7d'
  });
  
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS Attacks
    sameSite: 'strict', // prevent CSRF Attacks
    secure: process.env.NODE_ENV !== 'development'
  });
  
  return token;
};

export function asyncHandler(fn) {
  return async function(req, res, next) {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: 'Internal Server Error.' });
    }
  }
};
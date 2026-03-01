import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default async function protectedRoute(req, res, next) {
  const token = res.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized: No token found.'
    })
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid token.'
    })
  }
  
  const user = await User.findById(decoded.userId).select('-password');
  if (!user) {
    return res.status(404).json({
      message: 'User not found.'
    })
  }
  
  req.user = user;
  next();
}
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return res.status(400).json({ message: 'Email already exists.' });
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword
  });
  
  if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic
    });
  } else {
    return res.status(400).json({ message: 'Error creating account.' })
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }
  
  generateToken(user._id, res);
  
  return res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic
  });
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully.' });
};

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  
  if (!profilePic) {
    return res.status(400).json({
      message: 'No profile pic provided.'
    })
  }
  
  const uploadRes = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await User.findByIdAndUpdate(userId, {
    profilePic: uploadRes.secure_url
  }, { new: true });
  
  res.status(200).json({updatedUser});
};

export const checkAuth = (req, res) => {
  return res.status(200).json(req.user);
};
import bcrypt from 'bcryptjs';
import generateToken from '../lib/utils.js';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
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
        id: newUser._id,
        fullName,
        email,
        profilePic: newUser.profilePic
      })
    } else {
      return res.status(400).json({ message: 'Error creating account.' })
    }
    
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error.' });
    console.log('Error in signup controller', e.message);
  }
};

export const login = (req, res) => {
  res.send('signup api');
};

export const logout = (req, res) => {
  res.send('signup api');
};
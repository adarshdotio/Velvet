import User from '../models/user.model.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const isEmailExists = await User;
  } catch (e) {
    throw e
  }
};

export const signup = (req, res) => {
  res.send('signup api');
};

export const signup = (req, res) => {
  res.send('signup api');
};
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signupController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({
        succcess: false,
        message: 'Please enter all fields',
      });
    if (username.length < 3)
      return res.status(400).json({
        succcess: false,
        message: 'Username must be at least 3 characters long',
      });
    if (password.length < 6)
      return res.status(400).json({
        succcess: false,
        message: 'Password must be at least 6 characters long',
      });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({
        succcess: false,
        message: 'Invalid email address',
      });
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists)
      return res.status(400).json({
        succcess: false,
        message: 'User already exists',
      });
    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image,
    });

    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    res.status(201).json({
      succcess: true,
      user: { ...newUser._doc, password: undefined },
    });
  } catch (error) {
    console.log('Error at signupController', error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({
        succcess: false,
        message: 'Please enter all fields',
      });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        succcess: false,
        message: 'User does not exist',
      });
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        succcess: false,
        message: 'Invalid credentials',
      });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      succcess: true,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log('Error at loginController', error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie('jwt-netflix');
    res.status(200).json({
      succcess: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log('Error at logoutController', error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const authCheckController = async (req, res) => {
  try {
    res.status(200).json({
      succcess: true,
      user: req.user,
    });
  } catch (error) {
    console.log('Error at authCheckController', error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

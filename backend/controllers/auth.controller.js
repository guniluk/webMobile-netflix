import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signupController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Please enter all fields' });
    if (username.length < 3)
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long',
      });
    if (password.length < 6)
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email address' });

    if (await User.findOne({ $or: [{ username }, { email }] }))
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });

    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
    const hashedPassword = await bcryptjs.hash(
      password,
      await bcryptjs.genSalt(10),
    );

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      image,
    });
    const token = generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      success: true,
      user: { ...newUser._doc, password: undefined },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Please enter all fields' });
    const user = await User.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.password)))
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });

    const token = generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      user: { ...user._doc, password: undefined },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie('jwt-netflix');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const authCheckController = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware.js';
import { handleApiError, createErrorResponse } from '../utils/errorHandler.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (NEW ROUTE - Add this)
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json(createErrorResponse('Please provide all required fields', 400, {
        fields: {
          name: name ? true : false,
          email: email ? true : false,
          password: password ? true : false
        }
      }));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json(createErrorResponse('User with this email already exists', 400));
    }

    // Create user with validated data
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    if (user) {
      // Return user data with token
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        elderlyMode: user.elderlyMode,
        medicalHistory: user.medicalHistory,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json(createErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    handleApiError(error, res);
  }
});

// @desc    Validate user token
// @route   GET /api/users/validate
// @access  Private
router.get('/validate', protect, async (req, res) => {
  try {
    // If middleware passes, token is valid
    // Return user data without password
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json(createErrorResponse('User not found', 404));
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        elderlyMode: user.elderlyMode,
        medicalHistory: user.medicalHistory
      }
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

// @desc    Register a new user (original route)
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json(createErrorResponse('Please provide all required fields', 400, {
        fields: {
          name: name ? true : false,
          email: email ? true : false,
          password: password ? true : false
        }
      }));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json(createErrorResponse('User with this email already exists', 400));
    }

    // Create user with validated data
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    if (user) {
      // Return user data with token
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        elderlyMode: user.elderlyMode,
        medicalHistory: user.medicalHistory,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json(createErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    handleApiError(error, res);
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Add console log for debugging
    console.log('Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json(createErrorResponse('Please provide email and password', 400, {
        fields: {
          email: email ? true : false,
          password: password ? true : false
        }
      }));
    }

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if user exists and password matches
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json(createErrorResponse('Invalid email or password', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json(createErrorResponse('Invalid email or password', 401));
    }

    // Return user data with token
    console.log('Login successful for user:', email);
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      elderlyMode: user.elderlyMode,
      medicalHistory: user.medicalHistory,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    handleApiError(error, res);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        elderlyMode: user.elderlyMode,
        medicalHistory: user.medicalHistory
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.elderlyMode = req.body.elderlyMode !== undefined ? req.body.elderlyMode : user.elderlyMode;
      
      if (req.body.medicalHistory) {
        user.medicalHistory = req.body.medicalHistory;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        elderlyMode: updatedUser.elderlyMode,
        medicalHistory: updatedUser.medicalHistory,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
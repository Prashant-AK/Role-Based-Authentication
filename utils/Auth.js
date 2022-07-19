const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { SECRET } = require('../config');

/*
   @DESC TO REGISTER THE USER (ADMIN,SUPER_ADMIN,USER)
*/

const userRegister = async (userData, role, res) => {
  try {
    let userNameTaken = await validateUserName(userData.username);
    if (userNameTaken) {
      console.log('username', userNameTaken, userData.username);
      return res.status(400).json({
        message: 'UserName is already taken',
        success: false,
      });
    }

    // Validate the Email
    let userEmailTaken = await validateEmail(userData.email);
    if (userEmailTaken) {
      console.log('user Email', userEmailTaken);
      return res.status(400).json({
        message: 'Email already exist',
        success: false,
      });
    }
    // Get the hash Password
    const hashPassword = await bcrypt.hash(userData.password, 12);
    // Create a new user
    const newUser = new User({
      ...userData,
      password: hashPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({
      message: 'Successfully registered please login',
      success: true,
    });
  } catch (error) {
    // Learn about logger function Winston
    return res.status(500).json({
      message: 'Unable to create you account',
      success: false,
    });
  }
};

/*
   @DESC TO LOGIN THE USER (ADMIN,SUPER_ADMIN,USER)
*/

const userLogin = async (userData, role, res) => {
  const { email, password } = userData;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'Email is not found. Invalid login credentials',
        success: false,
      });
    }
    if (user.role !== role) {
      return res.status(403).json({
        message: 'Please make sure you are logging in from the right portal',
        success: false,
      });
    }
    //  User is existing and trying to signin from the right portal

    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        SECRET,
        { expiresIn: '2 days' }
      );
      let result = {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: '48 h',
      };
      return res.status(200).json({
        ...result,
        message: 'Successfully login',
        success: true,
      });
    } else {
      return res.status(403).json({
        message: 'Incorrect password try again',
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Unable to login due to ${error}`,
      success: false,
    });
  }
};

const validateUserName = async (username) => {
  let user = await User.findOne({ username });
  // console.log('user is ', user);
  return user ? true : false;
};
const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  // console.log('user email', user);
  return user ? true : false;
};

/*
   @DESC Check Role middleWare
*/

const checkRole = (roles) => (req, res, next) =>
  !roles.include(req.user.role) ? res.status(401).json('Unauthorized') : next();
/*
   @DESC Passport middleWare
*/

const userAuth = passport.authenticate('jwt', { session: false });

module.exports = { userRegister, userLogin, checkRole, userAuth };

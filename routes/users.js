const router = require('express').Router();

// Register funcion
const {
  userRegister,
  userLogin,
  checkRole,
  userAuth,
} = require('../utils/Auth');

// user Registeration route
router.post('/register-user', async (req, res) => {
  await userRegister(req.body, 'user', res);
});

// Admin Registeration route
router.post('/register-admin', async (req, res) => {
  await userRegister(req.body, 'admin', res);
});

// SuperAdmin Registeration route
router.post('/register-super-admin', async (req, res) => {
  await userRegister(req.body, 'superAdmin', res);
});

// Users Login Route
router.post('/login-user', async (req, res) => {
  await userLogin(req.body, 'user', res);
});

// Admin Login Route
router.post('/login-admin', async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

// SuperAdmin Login Route
router.post('/login-super-admin', async (req, res) => {
  await userLogin(req.body, 'superAdmin', res);
});

// Profile Route
router.get(
  '/profile',
  userAuth,
  checkRole(['admin', 'user', 'superAdmin']),
  async (req, res) => {
    return res.json(req.user);
  }
);

// Admin Protected Route
router.get(
  '/admin-protected',
  userAuth,
  checkRole(['admin']),
  async (req, res) => {
    return res.json(req.user);
  }
);

// Users Protected Route
router.get(
  '/user-protected',
  userAuth,
  checkRole(['superAdmin']),
  async (req, res) => {
    return res.json(req.user);
  }
);

// SuperAdmin Protected Route
router.get(
  '/super-admin-protected',
  userAuth,
  checkRole(['superAdmin']),
  async (req, res) => {
    return res.json(req.user);
  }
);

// Route accessible to admin and superAdmin only
router.get(
  '/super-admin-admin-protected',
  userAuth,
  checkRole(['admin', 'superAdmin']),
  async (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;

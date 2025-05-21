const express = require('express');
const {
  createUser,
  loginUser,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', createUser);
router.post('/signin', loginUser);
router.get('/me', auth, getCurrentUser);

module.exports = router;

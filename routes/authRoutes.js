const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route cho login page
router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/inbox');
  }
  res.render('sign-in', { error: null }); 
});

router.post('/login', authController.login);

// Route cho sign up page
router.get('/sign-up', (req, res) => {
  res.render('sign-up', { error: null });
});

router.post('/register', authController.register);

// Route logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/inbox');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;

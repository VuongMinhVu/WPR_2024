const User = require('../models/userModel');

const authController = {
    async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (user && user.password === password) {
          req.session.userId = user.id;
          req.session.user = user;  // save in
          res.redirect('/inbox');
        } else {
          res.render('sign-in', { error: 'Email hoặc mật khẩu không đúng!' });
        }
      },

  async register(req, res) {
    const { fullName, email, password, confirmPassword } = req.body;
    // conditions
    if (!fullName || !email || !password || !confirmPassword) {
        return res.render('sign-up', { error: 'Please fill in all information.' });
      }
  
      if (password.length < 6) {
        return res.render('sign-up', { error: 'Password must be at least 6 characters.' });
      }
  
      if (password !== confirmPassword) {
        return res.render('sign-up', { error: 'Re-entered password does not match.' });
      }
  
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render('sign-up', { error: 'Email already exists!' });
      }
  
      await User.createUser(fullName, email, password);
      res.render('sign-in', { message: 'Sign up successfully, please sign in!', error: null });
    },
};

module.exports = authController;

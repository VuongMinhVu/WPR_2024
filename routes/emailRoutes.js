const express = require('express');
const emailController = require('../controllers/emailController');
const multer = require('multer');

const upload = multer();
const router = express.Router();

// Middleware check login status
function requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.status(403).render('access-denied', { message: 'Access Denied' });
    }
    next();
  }
  

// Route cho inbox page
router.get('/inbox', requireAuth, emailController.inbox);

// Route cho outbox page
router.get('/outbox', requireAuth, emailController.outbox);

// Route cho compose page
router.get('/compose', requireAuth, emailController.composePage); // Đảm bảo `composePage` tồn tại
router.post('/compose', requireAuth, upload.single('attachment'), emailController.compose);

// Route cho trang chi tiết email
router.get('/email/:id', requireAuth, emailController.emailDetail); // Đảm bảo `emailDetail` tồn tại

// API delete email
router.delete('/api/delete-email/:id', requireAuth, emailController.deleteEmail);
module.exports = router;

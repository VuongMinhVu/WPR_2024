const Email = require('../models/emailModel');
const User = require('../models/userModel');

const emailController = {
  // take emails list
  async inbox(req, res) {
    try {
      const userId = req.session.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const offset = (page - 1) * limit;

      // Gọi model để lấy email received
      const emails = await Email.getReceivedEmails(userId, limit, offset);
      
      // Lấy user detail hien tại từ database or session
      const user = req.session.user || await User.findById(userId);

      // Render inbox page với emails list, page, và user detail
      res.render('inbox', { emails, page, user });
    } catch (error) {
      console.error("Error loading inbox:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // take emails list in sended emails
  async outbox(req, res) {
    try {
      const userId = req.session.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const offset = (page - 1) * limit;
      
      // Gọi model để lấy email đã gửi
      const emails = await Email.getSentEmails(userId, limit, offset);
      
      // Render outbox page với email list và page
      res.render('outbox', { emails, page, user: req.session.user });
    } catch (error) {
      console.error("Error loading outbox:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Hiển thị compose email
  async composePage(req, res) {
    try {
      const users = await User.getAllUsersExcept(req.session.userId);
      res.render('compose', { users, user: req.session.user, error: null });
    } catch (error) {
      console.error("Error loading compose page:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  async compose(req, res) {
    try {
      const { recipientId, subject, body } = req.body;
      const senderId = req.session.userId;
  
      console.log("Form data:", req.body);
      console.log("File data:", req.file);
  
      // turn recipientId into int và check
      const recipientIdNumber = parseInt(recipientId, 10);
  
      if (!recipientIdNumber || isNaN(recipientIdNumber)) {
        const users = await User.getAllUsersExcept(senderId);
        return res.render('compose', {
          users,
          user: req.session.user,
          error: 'Recipient is required'
        });
      }
  
      // Xử lý email gửi đi, bao gồm cả attachment nếu cần
      const attachment = req.file ? req.file.originalname : null; // Lấy tên file nếu có
      await Email.sendEmail(senderId, recipientIdNumber, subject, body, attachment);
      res.redirect('/outbox');
    } catch (error) {
      console.error("Error sending email:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },

  // display email detail
    async emailDetail(req, res) {
        try {
        const emailId = req.params.id;
        const userId = req.session.userId;

        // Gọi getEmailById to get email details
        const email = await Email.getEmailById(emailId, userId);

        if (!email) {
            return res.status(404).send("Email not found");
        }

        res.render('detail', { email, user: req.session.user });
        } catch (error) {
        console.error("Error loading email detail:", error);
        res.status(500).send("Internal Server Error");
        }
  },
    async deleteEmail(req, res) {
    try {
      const emailId = req.params.id;
      const userId = req.session.userId;

      // delete email by one side
      const result = await Email.deleteEmail(emailId, userId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Email not found or unauthorized' });
      }

      res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
      console.error("Error deleting email:", error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = emailController;

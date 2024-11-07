const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

// Sử dụng middleware để phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware take input form form
app.use(express.urlencoded({ extended: true }));

//session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.redirect('/login'); // direct to login page
});


const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
app.use('/', authRoutes);
app.use('/', emailRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

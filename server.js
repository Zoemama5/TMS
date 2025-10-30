const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'humprey-pogi';
const bcrypt = require('bcryptjs');

//env load
const dotenv = require('dotenv');
dotenv.config();

//GOOGLE AUTH
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

//Database
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const app = express();
const cookieParser = require('cookie-parser');

// Paths

const viewsPath = path.join(__dirname, 'presentation', 'static', 'views');
const assetsPath = path.join(__dirname, 'src/presentation/static/assets');

// Middleware
app.use(express.static(assetsPath));
app.use('/static', express.static(path.join(__dirname, 'presentation/static')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//GOOGLE AUTH // nOT DONE
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_USI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await Mcollection.findOne({ email });

        if (!user) {
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email,
            photo: profile.photos[0].value,
          };
          await Mcollection.insertOne(newUser);
          user = newUser;
        }

        return done(null, user);
      } catch (err) {
        console.error('Error saving user:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user)); // NOT DONE
passport.deserializeUser((user, done) => done(null, user)); // NOT DONE

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: '/success',
  })
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

app.get('/success', (req, res) => {
  res.send(`
    <h1>🎉 Google Login Successful!</h1>
    <p>Welcome, ${req.user?.name}</p>
    <img src="${req.user?.photo}" style="border-radius:50%; width:100px;">
    <p>Email: ${req.user?.email}</p>
    <a href="/logxd_">
      <button style="padding:10px 20px; background:#DB4437; color:white; border:none; border-radius:5px; cursor:pointer;">
        Logout
      </button>
    </a>
  `);
});

app.get('/logxd_', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/'); // redirect back to login page
  });
});

app.get('/login-failure', (req, res) => {
  res.send('<h1>Failed to login ❌</h1>');
});

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', viewsPath);

//Database connection

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

client.connect((error) => {
  if (error) {
    console.error('Error connecting to the MongoDB database:', error);
    return;
  }

  console.log('Connected to the MongoDB database');

  const Mdb = client.db('TMS');
  const Mcollection = Mdb.collection('User');

  // Example insert to test
  Mcollection.insertOne(
    { Email: 'test@example.com', Password: '123456' },
    (err, result) => {
      if (err) {
        console.error('Insert error:', err.message);
      } else {
        console.log('Insert success. ID:', result.insertedId);
      }
    }
  );
});
const Mdb = client.db('TMS');
const Mcollection = Mdb.collection('User');
/*
const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // your MySQL password
  database: 'tms',
});

database.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});
*/
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'landingpage.html'));
});

app.get('/login-page', (req, res) => {
  res.sendFile(path.join(viewsPath, 'login-page-final.html'));
});

app.get('/forgot-page', (req, res) => {
  res.sendFile(path.join(viewsPath, 'forgot-password.html'));
});

// REGISTER
app.post('/register-action', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists in MongoDB
    const existingUser = await Mcollection.findOne({ Email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into MongoDB
    await Mcollection.insertOne({ Email: email, Password: hashedPassword });

    return res.json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Server error during registration' });
  }
});

// JWT
app.post('/login-action', async (req, res) => {
  const { email, password } = req.body;
  const remember = req.body.remember === 'on'; // For Checkbox

  try {
    // Find user in MongoDB
    const user = await Mcollection.findOne({ Email: email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // If matched, create JWT token
    const expiresIn = remember ? '7d' : '1h';
    const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // in ms

    const token = jwt.sign({ id: user._id, email: user.Email }, secretKey, {
      expiresIn,
    });

    // Store token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      maxAge,
    });

    return res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Server error during login' });
  }
});

app.get('/login-success', (req, res) => {
  res.sendFile(path.join(viewsPath, 'main.html'));
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged Out Successfully' });
});

const crypto = require('crypto');

app.post('/forgot-password-action', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Mcollection.findOne({ Email: email });

    if (!user) return res.status(404).json({ message: 'Email not found' });

    const code = crypto.randomInt(100000, 999999).toString(); // 6-digit code
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Mcollection.updateOne(
      { Email: email },
      { $set: { resetCode: code, resetCodeExpires: expires } }
    );

    await sendEmail(
      email,
      'Your Password Reset Code',
      `Your password reset code is: ${code}\nThis code will expire in 10 minutes.`
    );

    res.json({ success: true, message: 'Reset code sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//EMAIL FUNCTION FOR TESTING TOMORROW

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// Validate Code
app.post('/validate-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await Mcollection.findOne({ Email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetCode || !user.resetCodeExpires) {
      return res
        .status(400)
        .json({ message: 'No reset code found. Please request a new one.' });
    }

    const now = new Date();

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (now > user.resetCodeExpires) {
      return res.status(400).json({ message: 'Code expired' });
    }

    // Optional: clear the code after successful verification
    await Mcollection.updateOne(
      { Email: email },
      { $unset: { resetCode: '', resetCodeExpires: '' } }
    );

    res.json({
      success: true,
      message: 'Code verified. You can now reset your password.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/change-password-action', async (req, res) => {
  try {
    const { email, password, password2 } = req.body;

    if (password !== password2) {
      return res.json({ success: false, message: 'Passwords do not match' });
    }

    const user = await Mcollection.findOne({ Email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    await Mcollection.updateOne(
      { Email: email },
      { $set: { Password: hashedPassword } }
    );

    return res.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

// Example JWT Auth route
/*
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    // Dummy payload and secret
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Username and password are required' });
  }
});*/

// Start server

//DONE
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`TMS app is running at http://localhost:${PORT}`);
});

// THIS IS A TEST

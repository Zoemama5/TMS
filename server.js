const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'humprey-pogi';
const bcrypt = require('bcryptjs');
//Database
const mongoose = require('mongoose');
const mysql = require('mysql2');
const app = express();
const cookieParser = require("cookie-parser");

// Paths
const uri = 'mongodb://localhost:27017/Coral'; 
const viewsPath = path.join(__dirname, 'presentation', 'static', 'views');
const assetsPath = path.join(__dirname, 'src/presentation/static/assets');

// Middleware
app.use(express.static(assetsPath));
app.use('/static', express.static(path.join(__dirname, 'presentation/static')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', viewsPath);


//Database connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // your MySQL password
  database: 'tms'
});

database.connect((err) => {
  if (err) {
      console.error('Error connecting to the database:', err);
      return;
  }
  console.log('Connected to the MySQL database');
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'landingpage.html'));
});

app.get('/login-page', (req, res) => {
  res.sendFile(path.join(viewsPath, 'login-page-final.html'));
});

app.get('/forgot-page', (req, res) =>{
  res.sendFile(path.join(viewsPath,'forgot-password.html'));
});


// REGISTER
app.post('/register-action', (req, res) => {
  const { email, password, confirmPassword } = req.body;



  bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
          console.log("Hashing error:", err);
          return res.json({ success: false, message: "Error hashing password" });
      }

      database.query('INSERT INTO users (email, password) VALUES (?, ?)', 
          [email, hash], 
          (err, result) => {
              if (err) {
                  console.log("Database error:", err); // Log the error
                  return res.json({ success: false, message: "Error registering user" });
              }
              return res.json({ success: true, message: "User registered successfully!" });
          }
      );
  });
})


// JWT
app.post('/login-action', (req, res) => {
  const { email, password } = req.body;
  const remember =  req.body.remember === "on"; // For Checkbox

  database.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.log("Database error:", err);
      return res.json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log("Comparison error:", err);
        return res.json({ success: false, message: "Error checking password" });
      }
      if (!isMatch) {
        return res.json({ success: false, message: "Incorrect password" });
      }

      // Password matched, create JWT token
      const expiresIn = remember ? "7d" : "1h";
      const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // in ms

      const token = jwt.sign(
        { id: user.id, email: user.email },
        secretKey,
        { expiresIn }
      );

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true if you're using HTTPS in production
        maxAge,
      });
      return res.json({ success: true, message: "Login successful!" });
    });
  });
});







app.get('/login-success', (req, res) => {
  res.sendFile(path.join(viewsPath, 'main.html'));
});

app.post('/logout', (req,res)=>{
  res.clearCookie("token");
  res.json({success:true, message: "Logged Out Successfully"});
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`TMS app is running at http://localhost:${PORT}`);
});

// THIS IS A TEST
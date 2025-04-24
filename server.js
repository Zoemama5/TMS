const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//Database
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const app = express();

// Paths
const uri = 'mongodb://localhost:27017/Coral'; 
const viewsPath = path.join(__dirname, 'presentation', 'static', 'views');
const assetsPath = path.join(__dirname, 'src/presentation/static/assets');

// Middleware
app.use(express.static(assetsPath));
app.use(bodyParser.json());

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



async function connectToMySQL() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'tms'
    });

    console.log('Connected to MySQL');
    // You can use `connection` here to run queries
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
}
connectToMySQL();
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

app.get('/login-page', (req, res) => {
  res.render('login-page'); 
  console.log('GET /login-page hit!');
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

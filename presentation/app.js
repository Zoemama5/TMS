const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sessionConfig } = require('../infrastructure/Config/sessionConfig');

const path = require('path');

const landingRoutes = require('./routes/landingRoutes');
const loginRoute = require('./routes/loginRoute');

const passport = require('../infrastructure/Security/googleStrategy');
const { connectMongo } = require('../infrastructure/database/mongo');
const { SESSION_SECRET } = require('../infrastructure/config');

const authRoutes = require('./routes/authRoutes');
// Create app
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
*/
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Database connections
connectMongo();

// Static paths
app.set('views', path.join(__dirname, 'static', 'views'));
app.use(express.static(path.join(__dirname, 'static', 'assets')));
//

app.use('/', landingRoutes);
app.use('/', loginRoute);
app.use('/auth', authRoutes);

module.exports = app;

const session = require('express-session');
const { SESSION_SECRET } = require('./index');
const sessionConfig = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});

module.exports = { sessionConfig };

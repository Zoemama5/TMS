const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { client_ID, client_Secret } = require('../config');

passport.use(
  new GoogleStrategy(
    {
      clientID: client_ID,
      clientSecret: client_Secret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // TEMP: pass profile directly, replace with DB logic later
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

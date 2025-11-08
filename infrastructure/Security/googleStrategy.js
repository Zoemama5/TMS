const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../../infrastructure/Database/Models/User');
const { client_ID, client_Secret, callback_URL } = require('../Config/index');
console.log(client_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: client_ID,
      clientSecret: client_Secret,
      callbackURL: callback_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let existingUser = await User.findOne({ email });

        // If user doesn't exist, create a new one
        if (!existingUser) {
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email,
            photo: profile.photos[0].value,
          };

          existingUser = await User.create(newUser);
        }

        return done(null, existingUser);
      } catch (err) {
        console.error('Error saving user:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;

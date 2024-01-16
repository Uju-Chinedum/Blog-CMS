// Package Imports
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// User Defined Imports
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ "google.id": profile.id });
        if (user) {
          return done(null, user); // Log them in
        } else {
          // Create new user
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            isVerified: true,
            verified: Date.now(),
            google: {
              id: profile.id,
              token: accessToken,
            },
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

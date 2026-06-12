const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const db = require('./database');
require('dotenv').config();

// استراتيجية Google
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // البحث عن المستخدم
      const result = await db.query(
        'SELECT * FROM users WHERE google_id = $1',
        [profile.id]
      );

      let user = result.rows[0];

      if (!user) {
        // إنشاء مستخدم جديد
        const insertResult = await db.query(
          'INSERT INTO users (email, name, google_id, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
          [profile.emails[0].value, profile.displayName, profile.id, profile.photos[0]?.value || null]
        );
        user = insertResult.rows[0];
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// استراتيجية Apple
passport.use(new AppleStrategy(
  {
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    key: process.env.APPLE_CLIENT_SECRET,
    callbackURL: '/api/auth/apple/callback'
  },
  async (accessToken, refreshToken, decodedIdToken, profile, done) => {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE apple_id = $1',
        [decodedIdToken.sub]
      );

      let user = result.rows[0];

      if (!user) {
        const insertResult = await db.query(
          'INSERT INTO users (email, name, apple_id) VALUES ($1, $2, $3) RETURNING *',
          [decodedIdToken.email, profile.displayName || 'Apple User', decodedIdToken.sub]
        );
        user = insertResult.rows[0];
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// حفظ المستخدم في الجلسة
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// استرجاع المستخدم من الجلسة
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
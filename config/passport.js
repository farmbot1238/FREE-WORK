const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const { db, auth } = require('./firebase');
require('dotenv').config();

// استراتيجية Google
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const userDoc = await db.collection('users').doc(email).get();
      
      let user = {
        email,
        name: profile.displayName,
        googleId: profile.id,
        profilePicture: profile.photos[0]?.value || null,
        loginMethod: 'google',
        lastLogin: new Date()
      };

      if (!userDoc.exists) {
        // إنشاء مستخدم جديد
        await db.collection('users').doc(email).set({
          ...user,
          createdAt: new Date()
        });
        console.log(`✨ مستخدم جديد تم إنشاؤه: ${email}`);
      } else {
        // تحديث آخر تسجيل دخول
        await db.collection('users').doc(email).update({
          lastLogin: new Date()
        });
      }

      return done(null, { email, ...user });
    } catch (error) {
      console.error('❌ Google authentication error:', error);
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
    callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback'
  },
  async (accessToken, refreshToken, decodedIdToken, profile, done) => {
    try {
      const email = decodedIdToken.email;
      const userDoc = await db.collection('users').doc(email).get();
      
      let user = {
        email,
        name: profile.name?.firstName + ' ' + (profile.name?.lastName || '') || 'Apple User',
        appleId: decodedIdToken.sub,
        loginMethod: 'apple',
        lastLogin: new Date()
      };

      if (!userDoc.exists) {
        // إنشاء مستخدم جديد
        await db.collection('users').doc(email).set({
          ...user,
          createdAt: new Date()
        });
        console.log(`✨ مستخدم جديد تم إنشاؤه: ${email}`);
      } else {
        // تحديث آخر تسجيل دخول
        await db.collection('users').doc(email).update({
          lastLogin: new Date()
        });
      }

      return done(null, { email, ...user });
    } catch (error) {
      console.error('❌ Apple authentication error:', error);
      return done(error);
    }
  }
));

// حفظ المستخدم في الجلسة
passport.serializeUser((user, done) => {
  done(null, user.email);
});

// استرجاع المستخدم من الجلسة
passport.deserializeUser(async (email, done) => {
  try {
    const userDoc = await db.collection('users').doc(email).get();
    if (userDoc.exists) {
      done(null, { email, ...userDoc.data() });
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

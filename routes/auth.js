const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
require('../config/passport');

const router = express.Router();

// تسجيل الدخول عن طريق Google
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  (req, res) => {
    try {
      // إنشاء JWT Token
      const token = jwt.sign(
        { 
          email: req.user.email, 
          name: req.user.name,
          loginMethod: 'google'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // حفظ التوكن في قاعدة البيانات
      db.collection('users').doc(req.user.email).update({
        lastToken: token,
        lastTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }).catch(err => console.error('Error saving token:', err));

      // إعادة التوجيه إلى صفحة النجاح
      const userData = encodeURIComponent(JSON.stringify({
        email: req.user.email,
        name: req.user.name,
        loginMethod: 'google',
        profilePicture: req.user.profilePicture
      }));

      res.redirect(`http://localhost:3000/success.html?token=${token}&user=${userData}`);
    } catch (error) {
      console.error('❌ Error in Google callback:', error);
      res.redirect('/?error=processing_failed');
    }
  }
);

// تسجيل الدخول عن طريق Apple
router.get('/apple',
  passport.authenticate('apple')
);

router.post('/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/?error=auth_failed' }),
  (req, res) => {
    try {
      // إنشاء JWT Token
      const token = jwt.sign(
        { 
          email: req.user.email, 
          name: req.user.name,
          loginMethod: 'apple'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // حفظ التوكن في قاعدة البيانات
      db.collection('users').doc(req.user.email).update({
        lastToken: token,
        lastTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }).catch(err => console.error('Error saving token:', err));

      // إعادة التوجيه إلى صفحة النجاح
      const userData = encodeURIComponent(JSON.stringify({
        email: req.user.email,
        name: req.user.name,
        loginMethod: 'apple'
      }));

      res.redirect(`http://localhost:3000/success.html?token=${token}&user=${userData}`);
    } catch (error) {
      console.error('❌ Error in Apple callback:', error);
      res.redirect('/?error=processing_failed');
    }
  }
);

// الحصول على بيانات المستخدم الحالي
router.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'غير مصرح', message: 'يجب تسجيل الدخول أولاً' });
  }

  try {
    const userDoc = await db.collection('users').doc(req.user.email).get();
    if (userDoc.exists) {
      res.json({
        success: true,
        user: {
          email: req.user.email,
          ...userDoc.data()
        }
      });
    } else {
      res.status(404).json({ error: 'المستخدم غير موجود' });
    }
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ error: 'خطأ في جلب البيانات' });
  }
});

// تسجيل الخروج
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في تسجيل الخروج' });
    }
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  });
});

// التحقق من التوكن
router.post('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'لا توجد رسالة توكن' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'توكن غير صالح أو منتهي الصلاحية' });
  }
});

module.exports = router;

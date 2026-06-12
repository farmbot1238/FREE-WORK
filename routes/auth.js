const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('../config/passport');

const router = express.Router();

// تسجيل الدخول عن طريق Google
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // إنشاء JWT Token
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // إعادة التوجيه إلى صفحة النجاح
    res.redirect(`http://localhost:3000/success.html?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// تسجيل الدخول عن طريق Apple
router.get('/apple',
  passport.authenticate('apple')
);

router.get('/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/login' }),
  (req, res) => {
    // إنشاء JWT Token
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // إعادة التوجيه إلى صفحة النجاح
    res.redirect(`http://localhost:3000/success.html?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// الحصول على بيانات المستخدم الحالي
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'غير مصرح' });
  }

  res.json({
    success: true,
    user: req.user
  });
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
    res.status(401).json({ error: 'توكن غير صالح' });
  }
});

module.exports = router;
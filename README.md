# 🚀 FREE WORK - منصة اختبر التجربة

موقع اختبار التجربة مع نظام تسجيل دخول متقدم باستخدام **Firebase** ☁️

## ✨ المميزات

✅ **تسجيل دخول عن طريق Google**  
✅ **تسجيل دخول عن طريق Apple**  
✅ **قاعدة بيانات Firebase** - آمنة وموثوقة  
✅ **نظام JWT** للأمان  
✅ **بدون الحاجة لتثبيت قاعدة بيانات محلية**  
✅ **كل شيء على السحابة** ☁️

---

## 🛠️ متطلبات التثبيت

### 1️⃣ تثبيت المكتبات

```bash
npm install
```

### 2️⃣ إعداد Firebase

**خطوات الحصول على بيانات Firebase:**

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. فعّل **Firestore Database** و **Google/Apple Authentication**
4. انسخ `serviceAccountKey.json` من إعدادات المشروع
5. ضع الملف في مجلد `config/`

### 3️⃣ إعداد المتغيرات البيئية

انسخ `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

ثم عدّل `.env` بالبيانات التالية:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_SERVICE_ACCOUNT_KEY=config/serviceAccountKey.json

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_CLIENT_SECRET=your_apple_client_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development
```

---

## 🚀 تشغيل المشروع

```bash
# تشغيل البيئة التطويرية مع nodemon
npm run dev

# أو تشغيل عادي
npm start
```

ثم افتح: **http://localhost:5000** 🌐

---

## 📁 هيكل المشروع

```
FREE-WORK/
├── config/
│   ├── firebase.js      # إعدادات Firebase
│   ├── passport.js      # استراتيجيات المصادقة
│   └── serviceAccountKey.json  # مفتاح Firebase (أضفه بنفسك)
├── routes/
│   └── auth.js         # مسارات المصادقة
├── public/
│   ├── index.html      # صفحة تسجيل الدخول
│   └── success.html    # صفحة النجاح
├── server.js           # السيرفر الرئيسي
├── package.json        # المتطلبات
├── .env.example        # متغيرات البيئة النموذجية
└── README.md          # هذا الملف
```

---

## 🔑 الحصول على مفاتيح Google و Apple

### Google OAuth:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. فعّل **Google+ API**
4. أنشئ **OAuth 2.0 Client ID** من نوع "Web application"
5. أضف `http://localhost:5000/api/auth/google/callback` إلى Authorized redirects

### Apple ID:
1. اذهب إلى [Apple Developer](https://developer.apple.com/)
2. أنشئ **Identifier** من نوع "Service ID"
3. أنشئ **Keys** و حمّل الملف الخاص
4. اتبع التعليمات الرسمية

---

## 📊 الدوال الرئيسية

### المسارات المتاحة:

```
GET  /                           - صفحة تسجيل الدخول الرئيسية
GET  /api/auth/google           - بدء تسجيل الدخول عبر Google
GET  /api/auth/google/callback  - استقبال البيانات من Google
GET  /api/auth/apple            - بدء تسجيل الدخول عبر Apple
POST /api/auth/apple/callback   - استقبال البيانات من Apple
GET  /api/auth/profile          - الحصول على بيانات المستخدم
GET  /api/auth/logout           - تسجيل الخروج
POST /api/auth/verify-token     - التحقق من صحة التوكن
GET  /api/health                - التحقق من حالة السيرفر
```

---

## 🔐 الأمان

✅ استخدام JWT Tokens  
✅ Secure Sessions  
✅ Firebase Security Rules  
✅ HTTPS Ready  
✅ CORS Configured  

---

## 🐛 استكشاف الأخطاء

### "Firebase not initialized"
- تأكد من وجود `serviceAccountKey.json` في مجلد `config/`
- تحقق من صحة البيانات في `.env`

### "Google authentication failed"
- تأكد من صحة `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET`
- تحقق من أن رابط Callback مسجل في Google Cloud Console

### "CORS error"
- تأكد من تفعيل CORS في `server.js`
- تحقق من رابط الـ Frontend الصحيح

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من ملف `.env`
2. تأكد من تفعيل Firebase في المشروع
3. راجع السجلات في Console Browser
4. ابحث عن الخطأ في Firebase Logs

---

## 📝 الترخيص

جميع الحقوق محفوظة © 2024 Free Work Platform

---

## 🎉 تم بناء المشروع بواسطة

**GitHub Copilot** ✨  
بتاريخ: 2024  
نسخة: 1.0.0  

---

**ملاحظة:** تأكد من أن جميع المتغيرات البيئية معبأة بشكل صحيح قبل التشغيل! 🔒

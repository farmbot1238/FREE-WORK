const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// تحميل مفتاح الخدمة من Firebase
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './config/serviceAccountKey.json';

try {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.error('تأكد من وجود ملف serviceAccountKey.json في مجلد config/');
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

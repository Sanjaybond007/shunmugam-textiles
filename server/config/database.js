const { initFirebaseAdmin, getFirestore } = require('./firebaseAdmin');

const connectDB = async () => {
  try {
    const admin = initFirebaseAdmin();
    if (!admin) {
      throw new Error('Firebase Admin SDK initialization failed');
    }

    const db = getFirestore();
    if (!db) {
      throw new Error('Firestore database connection failed');
    }

    // Skip connection test to avoid quota usage during startup
    console.log('Firebase Firestore Connected Successfully (quota-aware mode)');
    return db;
  } catch (error) {
    console.error('Firebase connection error:', error);
    if (error.code === 8 || error.message.includes('Quota exceeded')) {
      console.error('⚠️  Firebase quota exceeded. Please upgrade to Blaze plan or wait for quota reset.');
      console.error('📖 Guide: https://firebase.google.com/pricing');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
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

    // Test the connection by trying to access a collection
    await db.collection('_test').limit(1).get();
    
    console.log('Firebase Firestore Connected Successfully');
    return db;
  } catch (error) {
    console.error('Firebase connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
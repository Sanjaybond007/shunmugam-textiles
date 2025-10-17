const admin = require('firebase-admin');
const path = require('path');

let initialized = false;

function initFirebaseAdmin() {
  if (initialized) return admin;

  try {
    // Try to load service account from JSON string first
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      // Load from file path
      serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    } else {
      // Try to load from default location
      try {
        serviceAccount = require(path.join(__dirname, '../config/firebase-service-account.json'));
      } catch (err) {
        console.warn('[firebase-admin] No Firebase service account found. Please set FIREBASE_SERVICE_ACCOUNT_JSON or place firebase-service-account.json in server/config/');
        return null;
      }
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    initialized = true;
    console.log('[firebase-admin] Initialized successfully');
    return admin;
  } catch (err) {
    console.error('[firebase-admin] Failed to initialize Admin SDK:', err.message);
    return null;
  }
}

const getFirestore = () => {
  const app = initFirebaseAdmin();
  return app ? admin.firestore() : null;
};

const getAuth = () => {
  const app = initFirebaseAdmin();
  return app ? admin.auth() : null;
};

module.exports = { admin, initFirebaseAdmin, getFirestore, getAuth };

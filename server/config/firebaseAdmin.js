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
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Build service account from individual environment variables
      serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
      };
    } else {
      // Try to load from default location
      try {
        serviceAccount = require(path.join(__dirname, '../config/firebase-service-account.json'));
      } catch (err) {
        console.warn('[firebase-admin] No Firebase service account found. Please set FIREBASE_SERVICE_ACCOUNT_JSON or individual Firebase environment variables');
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

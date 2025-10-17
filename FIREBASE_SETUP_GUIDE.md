# 🔥 Firebase Configuration Setup Guide

## 📋 Step-by-Step Instructions

### **1. Create/Access Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or select existing project
3. Follow the setup wizard (enable Google Analytics if desired)

### **2. Enable Authentication**

1. In Firebase Console → **Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Optionally enable **Google** sign-in

### **3. Set up Firestore Database**

1. In Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll update rules later)
4. Select a location close to your users

### **4. Get Client Configuration (React App)**

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web** (</>) icon
4. Give your app a nickname: `Shunmugam Textiles Web`
5. **Don't** check "Set up Firebase Hosting"
6. Click **"Register app"**

You'll see configuration like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "shunmugam-textiles.firebaseapp.com",
  projectId: "shunmugam-textiles",
  storageBucket: "shunmugam-textiles.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Copy these values to your `client/.env` file:**
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=shunmugam-textiles.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=shunmugam-textiles
REACT_APP_FIREBASE_STORAGE_BUCKET=shunmugam-textiles.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### **5. Get Server Configuration (Service Account)**

1. In Firebase Console → **Project Settings** → **Service Accounts** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** in the dialog
4. A JSON file will download - **KEEP THIS SECURE!**

The downloaded file looks like:
```json
{
  "type": "service_account",
  "project_id": "shunmugam-textiles",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@shunmugam-textiles.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40shunmugam-textiles.iam.gserviceaccount.com"
}
```

**Copy these values to your `.env` file:**
```env
FIREBASE_PROJECT_ID=shunmugam-textiles
FIREBASE_PRIVATE_KEY_ID=abc123def456...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@shunmugam-textiles.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40shunmugam-textiles.iam.gserviceaccount.com
```

### **6. Generate JWT Secret**

Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output to your `.env` file:
```env
JWT_SECRET=your-generated-secret-here
```

### **7. Update Firestore Security Rules**

1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write products, employees, etc.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### **8. Set up Authentication Domains**

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (after deployment)

## 🔐 **Security Best Practices**

1. **Never commit** the service account JSON file to Git
2. **Use environment variables** for all sensitive data
3. **Restrict API keys** in Firebase Console → Project Settings → API Keys
4. **Set up proper Firestore rules** before going to production
5. **Enable App Check** for additional security (optional)

## ✅ **Verification Steps**

1. Create `.env` files from the examples
2. Fill in all the Firebase values
3. Run your application locally
4. Test user registration/login
5. Check Firestore for created documents

## 🚨 **Common Issues**

### **Issue**: "Firebase project not found"
**Solution**: Check `FIREBASE_PROJECT_ID` matches your actual project ID

### **Issue**: "Invalid private key"
**Solution**: Ensure private key includes `\n` characters and is wrapped in quotes

### **Issue**: "Permission denied"
**Solution**: Check Firestore security rules allow authenticated access

### **Issue**: "Auth domain not authorized"
**Solution**: Add your domain to Firebase Authentication → Settings → Authorized domains

## 📞 **Need Help?**

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com
- Check the browser console for detailed error messages

# 🚨 Deployment Troubleshooting Guide

## ✅ **Firebase Admin SDK Issue - FIXED**

### **Problem:**
```
[firebase-admin] No Firebase service account found. Please set FIREBASE_SERVICE_ACCOUNT_JSON or place firebase-service-account.json in server/config/
```

### **Solution Applied:**
Updated `server/config/firebaseAdmin.js` to properly use individual environment variables instead of requiring a JSON file.

### **What Changed:**
- Firebase Admin now builds service account object from individual env vars
- Properly handles `\n` characters in private key
- Uses correct cert URL format

---

## 🔧 **Updated Environment Variables**

### **Server (.env.production):**
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://shunmugam-textiles-frontend.onrender.com

# Firebase Configuration
FIREBASE_PROJECT_ID=shunmugam-textiles-web
FIREBASE_PRIVATE_KEY_ID=7df0a30c867af46d9c3f6789775c8ccb0bee62bd
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@shunmugam-textiles-web.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=108191503111030721107
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shunmugam-textiles-web.iam.gserviceaccount.com

# JWT Secret (Extended for security)
JWT_SECRET=[LONG_SECURE_SECRET]
```

### **Client (client/.env.production):**
```env
REACT_APP_API_URL=https://shunmugam-textiles-backend.onrender.com/api

# Firebase Client Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyDjsiKc23SNTOfJlGjd26a4TrOrBp97eIs
REACT_APP_FIREBASE_AUTH_DOMAIN=shunmugam-textiles-web.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=shunmugam-textiles-web
REACT_APP_FIREBASE_STORAGE_BUCKET=shunmugam-textiles-web.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=502855670485
REACT_APP_FIREBASE_APP_ID=1:502855670485:web:37333caab943e26b18a05c

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=ddalwamja
REACT_APP_CLOUDINARY_UPLOAD_PRESET=products
```

---

## 🚀 **Next Steps for Deployment**

### **1. Commit and Push Changes**
```bash
git add .
git commit -m "Fix Firebase Admin SDK configuration for Render deployment"
git push origin main
```

### **2. Deploy Backend on Render**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shunmugam-textiles-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Copy from `.env.production`

### **3. Deploy Frontend on Render**
1. Click **"New +"** → **"Static Site"**
2. Connect the same repository
3. Configure:
   - **Name**: `shunmugam-textiles-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**: Copy from `client/.env.production`

### **4. Add Redirect Rule for Frontend**
In Static Site Settings → Redirects/Rewrites:
```
/*    /index.html    200
```

---

## 🔍 **Common Issues & Solutions**

### **Issue 1: Build Fails**
**Check:** Build logs in Render dashboard
**Solution:** Ensure all dependencies are in `package.json`

### **Issue 2: Environment Variables Not Working**
**Check:** Environment tab in Render service settings
**Solution:** Verify all variables are set correctly (no extra spaces)

### **Issue 3: CORS Errors**
**Check:** Browser network tab for CORS errors
**Solution:** Ensure `FRONTEND_URL` matches actual frontend URL

### **Issue 4: Firebase Auth Fails**
**Check:** Firebase Console → Authentication → Settings → Authorized domains
**Solution:** Add your Render domains to authorized domains

### **Issue 5: Private Key Format Error**
**Check:** Logs for "Invalid private key" errors
**Solution:** Ensure private key has proper `\n` characters and quotes

---

## 📊 **Monitoring Your Deployment**

### **Backend Logs:**
- Render Dashboard → Your API service → Logs
- Look for: "Firebase Firestore Connected Successfully"

### **Frontend Logs:**
- Browser Developer Tools → Console
- Look for: Successful API calls to backend

### **Test Endpoints:**
- Backend health: `https://your-api-url.onrender.com/api/auth/test`
- Frontend: `https://your-frontend-url.onrender.com`

---

## 🎯 **Success Indicators**

✅ **Backend deployed successfully**
✅ **Firebase Admin SDK initialized**
✅ **Frontend built and deployed**
✅ **API calls working between frontend and backend**
✅ **User authentication working**
✅ **Database operations successful**

---

## 📞 **If You Still Have Issues**

1. **Check Render logs** for specific error messages
2. **Verify environment variables** are exactly as shown above
3. **Test locally first** with the same environment variables
4. **Check Firebase Console** for any configuration issues
5. **Ensure GitHub repository** has latest changes

**The Firebase Admin SDK issue has been resolved. Your application should now deploy successfully on Render!** 🎉

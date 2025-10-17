# 🚀 Render.com Deployment Guide for Shunmugam Textiles

## 📋 Prerequisites
- [x] GitHub account
- [x] Render.com account (sign up at https://render.com)
- [x] Firebase project with service account key
- [x] Cloudinary account for image uploads

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for Render deployment"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/shunmugam-textiles.git
git branch -M main
git push -u origin main
```

### 1.2 Update Environment Variables
Before deploying, update the following files with your actual values:

**`.env.production`** (Server environment):
- Replace `your-firebase-project-id` with your actual Firebase project ID
- Replace Firebase service account details
- Generate a strong JWT secret

**`client/.env.production`** (Client environment):
- Replace Firebase client configuration
- Update API URL after backend deployment

---

## 🚀 Step 2: Deploy Backend API

### 2.1 Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `shunmugam-textiles-api`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (uses root)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.2 Set Environment Variables
In the **Environment** tab, add these variables:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://shunmugam-textiles-frontend.onrender.com
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY_ID=your-actual-private-key-id
FIREBASE_PRIVATE_KEY=your-actual-private-key
FIREBASE_CLIENT_EMAIL=your-actual-client-email
FIREBASE_CLIENT_ID=your-actual-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_CLIENT_X509_CERT_URL=your-actual-cert-url
JWT_SECRET=your-super-secure-jwt-secret
```

### 2.3 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://shunmugam-textiles-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend

### 3.1 Create Static Site Service
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `shunmugam-textiles-frontend`
- **Branch**: `main`
- **Root Directory**: `client`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 3.2 Set Environment Variables
In the **Environment** tab, add:

```
REACT_APP_API_URL=https://shunmugam-textiles-backend.onrender.com/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_CLOUDINARY_CLOUD_NAME=ddalwamja
REACT_APP_CLOUDINARY_UPLOAD_PRESET=products
```

### 3.3 Add Redirect Rules
In **Settings** → **Redirects/Rewrites**, add:
```
/*    /index.html    200
```

### 3.4 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment (3-5 minutes)
3. Your app will be available at: `https://shunmugam-textiles-frontend.onrender.com`

---

## 🔄 Step 4: Update CORS Configuration

After both services are deployed:

1. Go to your backend service settings
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Redeploy the backend service

---

## 🔐 Step 5: Firebase Configuration

### 5.1 Update Firebase Authentication
1. Go to Firebase Console → Authentication → Settings
2. Add your Render domains to **Authorized domains**:
   - `shunmugam-textiles-frontend.onrender.com`
   - `shunmugam-textiles-api.onrender.com`

### 5.2 Update Firestore Security Rules
Ensure your Firestore rules allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🎯 Step 6: Testing & Verification

### 6.1 Test Your Application
1. Visit your frontend URL
2. Test user registration/login
3. Test admin dashboard functionality
4. Test image uploads
5. Verify all API endpoints work

### 6.2 Monitor Logs
- Backend logs: Render Dashboard → Your API service → Logs
- Frontend logs: Browser Developer Tools

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Ensure `FRONTEND_URL` environment variable matches your actual frontend URL

### Issue 2: Firebase Authentication Fails
**Solution**: Check Firebase authorized domains and environment variables

### Issue 3: Build Failures
**Solution**: Check build logs and ensure all dependencies are in `package.json`

### Issue 4: 404 Errors on Refresh
**Solution**: Ensure redirect rule `/* /index.html 200` is set for frontend

---

## 🔧 Maintenance

### Updating Your Application
1. Push changes to GitHub
2. Render will automatically redeploy
3. Monitor deployment logs for issues

### Environment Variables
- Update through Render Dashboard
- Restart services after changes

### Custom Domain (Optional)
1. Go to Settings → Custom Domains
2. Add your domain
3. Configure DNS records as instructed

---

## 📞 Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review deployment logs
3. Verify environment variables
4. Test locally first

**Your application should now be live and accessible worldwide! 🎉**

Frontend: https://shunmugam-textiles-frontend.onrender.com
Backend API: https://shunmugam-textiles-backend.onrender.com

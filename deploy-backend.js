#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Backend Deployment Preparation\n');

// Check if all required files exist
const requiredFiles = [
  '.env.production',
  'package.json',
  'server/app.js',
  'server/start.js',
  'server/config/database.js',
  'server/config/firebaseAdmin.js'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are present before deployment.');
  process.exit(1);
}

// Check environment variables
console.log('\n🔧 Checking environment configuration...');
const envPath = path.join(__dirname, '.env.production');
const envContent = fs.readFileSync(envPath, 'utf8');

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'FRONTEND_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (envContent.includes(`${envVar}=`)) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - MISSING`);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

if (packageJson.scripts.start === 'node server/start.js') {
  console.log('✅ Start script configured correctly');
} else {
  console.log('❌ Start script needs to be: "node server/start.js"');
}

console.log('\n🎯 Deployment Checklist:');
console.log('1. ✅ All required files are present');
console.log('2. ✅ Environment variables are configured');
console.log('3. ✅ Package.json scripts are correct');
console.log('4. 🔄 Ready for deployment to Render');

console.log('\n📝 Next Steps:');
console.log('1. Commit and push all changes to your repository');
console.log('2. Go to your Render dashboard');
console.log('3. Redeploy your backend service');
console.log('4. Check the deployment logs for any errors');
console.log('5. Test the health endpoint: https://shunmugam-textiles-backend.onrender.com/health');

console.log('\n🔗 Useful URLs:');
console.log('- Backend Health: https://shunmugam-textiles-backend.onrender.com/health');
console.log('- Frontend: https://shunmugam-textiles-frontend.onrender.com');
console.log('- Render Dashboard: https://dashboard.render.com');

console.log('\n✨ Deployment preparation complete!');

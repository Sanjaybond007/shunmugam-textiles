#!/usr/bin/env node

/**
 * Deployment Setup Script for Render.com
 * This script helps prepare your application for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Shunmugam Textiles - Render Deployment Setup');
console.log('================================================\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server/app.js',
  'client/package.json',
  '.env.production',
  'client/.env.production'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are present.');
  process.exit(1);
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = ['start', 'build'];
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ Missing script: ${script}`);
  }
});

// Check client package.json
console.log('\n📱 Checking client package.json...');
const clientPackageJson = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));

if (clientPackageJson.scripts && clientPackageJson.scripts.build) {
  console.log(`✅ client build: ${clientPackageJson.scripts.build}`);
} else {
  console.log(`❌ Missing client build script`);
}

// Environment variables check
console.log('\n🔐 Environment Variables Status:');
console.log('📄 Server (.env.production):');
const serverEnv = fs.readFileSync('.env.production', 'utf8');
const serverEnvVars = [
  'NODE_ENV',
  'PORT',
  'FIREBASE_PROJECT_ID',
  'JWT_SECRET'
];

serverEnvVars.forEach(envVar => {
  if (serverEnv.includes(envVar)) {
    const hasValue = !serverEnv.includes(`${envVar}=your-`) && !serverEnv.includes(`${envVar}=`);
    console.log(`${hasValue ? '✅' : '⚠️'} ${envVar} ${hasValue ? '' : '(needs actual value)'}`);
  } else {
    console.log(`❌ ${envVar} - MISSING`);
  }
});

console.log('\n📱 Client (.env.production):');
const clientEnv = fs.readFileSync('client/.env.production', 'utf8');
const clientEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_CLOUDINARY_CLOUD_NAME'
];

clientEnvVars.forEach(envVar => {
  if (clientEnv.includes(envVar)) {
    const hasValue = !clientEnv.includes(`${envVar}=your-`) && !clientEnv.includes(`${envVar}=`);
    console.log(`${hasValue ? '✅' : '⚠️'} ${envVar} ${hasValue ? '' : '(needs actual value)'}`);
  } else {
    console.log(`❌ ${envVar} - MISSING`);
  }
});

console.log('\n🎯 Next Steps:');
console.log('1. Update environment variables with actual values');
console.log('2. Push your code to GitHub');
console.log('3. Follow the RENDER_DEPLOYMENT_GUIDE.md');
console.log('4. Deploy backend first, then frontend');
console.log('\n📖 Full guide: ./RENDER_DEPLOYMENT_GUIDE.md');
console.log('\n🚀 Ready for deployment!');

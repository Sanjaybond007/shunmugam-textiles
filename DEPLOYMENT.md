# 🚀 Deployment Guide - Shunmugam Textiles Management System

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- FileZilla or similar FTP client
- Access to shared hosting with Node.js support

## 🏠 Local Development Setup

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE shunmugam_textiles;
USE shunmugam_textiles;

# Import schema
mysql -u root -p shunmugam_textiles < database/schema.sql
```

### 2. Environment Configuration
```bash
# Copy environment file
cp env.example .env

# Edit .env with your settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shunmugam_textiles
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 4. Start Development Servers
```bash
# Start both server and client
npm run dev

# Or start separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 🌐 Production Deployment

### Option 1: Shared Hosting (FileZilla + Apache/nginx)

#### Backend Deployment
1. **Upload Server Files**
   ```bash
   # Build the project
   npm run build
   ```
   
   Upload via FileZilla:
   - Upload `server/` folder contents to `/backend/`
   - Upload `client/build/` contents to `/public_html/`

2. **Database Setup**
   - Access phpMyAdmin
   - Create database: `shunmugam_textiles`
   - Import `database/schema.sql`

3. **Environment Configuration**
   - Create `.env` file in `/backend/`
   ```env
   NODE_ENV=production
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=shunmugam_textiles
   JWT_SECRET=your_production_jwt_secret
   PORT=5000
   ```

4. **Server Configuration**
   - Set up PM2 or similar process manager
   ```bash
   npm install -g pm2
   pm2 start server/app.js --name "shunmugam-textiles"
   pm2 save
   pm2 startup
   ```

#### Frontend Configuration
1. **Update API Base URL**
   - Edit `client/src/services/authService.js`
   - Change API_URL to your production backend URL

2. **Build for Production**
   ```bash
   cd client
   npm run build
   ```

### Option 2: VPS/Cloud Hosting

#### Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2
sudo npm install -g pm2
```

#### Application Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd shunmugam-textiles

# Install dependencies
npm install
cd client && npm install && cd ..

# Setup database
mysql -u root -p < database/schema.sql

# Configure environment
cp env.example .env
# Edit .env with production settings

# Build frontend
npm run build

# Start with PM2
pm2 start server/app.js --name "shunmugam-textiles"
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /var/www/html/server/uploads;
    }
}
```

## 🔧 Configuration Details

### Database Configuration
```javascript
// server/config/database.js
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shunmugam_textiles',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### JWT Configuration
```javascript
// server/middleware/auth.js
const token = jwt.sign(
  { userId: user.user_id, role: user.role, name: user.name },
  process.env.JWT_SECRET || 'shunmugam_secret',
  { expiresIn: '24h' }
);
```

### File Upload Configuration
```javascript
// server/app.js
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}));
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong JWT secrets
- Secure database passwords
- Enable HTTPS in production

### File Permissions
```bash
# Set proper permissions
chmod 755 server/uploads
chmod 644 server/.env
```

### Database Security
```sql
-- Create dedicated database user
CREATE USER 'shunmugam_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON shunmugam_textiles.* TO 'shunmugam_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📊 Monitoring & Maintenance

### PM2 Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs shunmugam-textiles

# Restart application
pm2 restart shunmugam-textiles

# Monitor resources
pm2 monit
```

### Database Backup
```bash
# Create backup script
#!/bin/bash
mysqldump -u root -p shunmugam_textiles > backup_$(date +%Y%m%d_%H%M%S).sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup_script.sh
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Test connection
   mysql -u your_user -p -h your_host
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **File Upload Issues**
   ```bash
   # Check uploads directory
   ls -la server/uploads/
   
   # Set permissions
   chmod 755 server/uploads/
   ```

4. **CORS Issues**
   - Verify CORS configuration in `server/app.js`
   - Check client URL in CORS settings

### Log Analysis
```bash
# Application logs
pm2 logs shunmugam-textiles

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_quality_entries_employee ON quality_entries(employee_id);
CREATE INDEX idx_quality_entries_date ON quality_entries(created_at);
```

### Node.js Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Set cache headers
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### Frontend Optimization
```bash
# Build with optimization
npm run build

# Enable gzip compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart application
pm2 restart shunmugam-textiles
```

### Database Migrations
```sql
-- Add new tables or modify existing ones
-- Always backup before migrations
mysqldump -u root -p shunmugam_textiles > backup_before_migration.sql
```

## 📞 Support

For deployment support:
- Email: info@shunmugamtextiles.com
- Phone: +91-44-12345678

---

**Shunmugam Textiles Management System** - Professional deployment guide for textile manufacturing management solution. 
# 🧵 Shunmugam Textiles Management System

A comprehensive full-stack web application for managing textile manufacturing operations, quality control, employee management, and customer relations.

## 🌟 Features

### 🌐 Public Website
- **Home Page**: Company introduction and featured products
- **About Us**: Company history, mission, and values
- **Products**: Showcase of textile products with quality details
- **Contact Us**: Contact form and company information

### 🔐 Authentication System
- Secure login with JWT tokens
- Role-based access control (Admin/Supervisor)
- Password hashing with bcrypt
- Session management

### 👨‍💼 Admin Dashboard
- **User Management**: Create, edit, delete users
- **Employee Management**: Add, edit, delete employees
- **System Statistics**: Overview of system data
- **Password Reset**: Secure password management
- **Excel Export**: Export employee data

### 👷 Supervisor Dashboard
- **Quality Entries**: Add daily quality-wise entries
- **Salary Reports**: Generate and export Excel reports
- **Product Management**: Manage product catalog
- **Search & Filter**: Advanced filtering capabilities
- **Image Upload**: Gallery management

### 📊 Reporting & Analytics
- Filter reports by date, employee, supervisor
- Excel export functionality
- Quality control tracking
- Salary calculation reports

### 🖼️ Gallery & File Management
- Image upload functionality
- Gallery display
- File management system

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **Bootstrap**: Responsive design
- **React Icons**: Icon library
- **Axios**: HTTP client
- **React Toastify**: Notifications

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MySQL**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-fileupload**: File uploads
- **xlsx**: Excel generation

### Database
- **MySQL**: Primary database
- **Connection Pooling**: Performance optimization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shunmugam-textiles
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE shunmugam_textiles;
USE shunmugam_textiles;

# Import schema
mysql -u root -p shunmugam_textiles < database/schema.sql
```

### 4. Environment Configuration
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shunmugam_textiles
JWT_SECRET=your_jwt_secret_key
```

### 5. Create Uploads Directory
```bash
mkdir server/uploads
```

### 6. Start Development Servers
```bash
# Start both server and client (development)
npm run dev

# Or start separately:
# Server only
npm run server

# Client only
npm run client
```

## 🔧 Configuration

### Database Configuration
Update `server/config/database.js` with your MySQL credentials:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shunmugam_textiles',
  // ... other options
});
```

### JWT Configuration
Set a strong JWT secret in your `.env` file:

```env
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

## 👤 Default Users

The system comes with a default admin user:

- **User ID**: `admin`
- **Password**: `password`
- **Role**: Admin

## 📁 Project Structure

```
shunmugam-textiles/
├── server/
│   ├── app.js                 # Main server file
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── admin.js          # Admin routes
│   │   ├── supervisor.js     # Supervisor routes
│   │   └── public.js         # Public routes
│   └── uploads/              # File upload directory
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── services/        # API services
│   │   └── index.css        # Styles
│   └── package.json
├── database/
│   └── schema.sql           # Database schema
├── package.json
└── README.md
```

## 🚀 Deployment

### Production Build
```bash
# Build React app
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=shunmugam_textiles
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### FileZilla Deployment (Shared Hosting)
1. Upload `server/` contents to `/backend/`
2. Upload `client/build/` contents to `/public_html/`
3. Configure `.env` with production database credentials
4. Set up MySQL database via phpMyAdmin
5. Import `database/schema.sql`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure file uploads

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create employee
- `GET /api/admin/stats` - System statistics

### Supervisor Routes
- `GET /api/supervisor/entries` - Get quality entries
- `POST /api/supervisor/entries` - Create entry
- `GET /api/supervisor/salary-report` - Get salary report
- `GET /api/supervisor/salary-report/export` - Export Excel
- `GET /api/supervisor/products` - Get products

### Public Routes
- `GET /api/public/company-info` - Company information
- `GET /api/public/products` - Public products
- `GET /api/public/gallery` - Gallery images
- `POST /api/public/contact` - Contact form

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing process on port 5000

3. **CORS Issues**
   - Check CORS configuration in `server/app.js`
   - Verify client URL in CORS settings

4. **File Upload Issues**
   - Ensure `server/uploads/` directory exists
   - Check file permissions
   - Verify file size limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and inquiries:
- Email: info@shunmugamtextiles.com
- Phone: +91-44-12345678

---

**Shunmugam Textiles Management System** - Professional textile manufacturing management solution. 
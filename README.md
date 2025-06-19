# 🏨 HavenHub - Hotel Booking Management System

A comprehensive full-stack hotel booking management system built with **Spring Boot** (backend) and **React.js** (frontend). HavenHub provides a modern, responsive interface for hotel management with role-based access control, real-time notifications, and advanced booking features.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Multi-role system**: Admin, Customer, Manager, Receptionist, Cleaner
- **Role-based access control** with protected routes
- **Customer self-registration** and **Admin-managed staff accounts**

### 👤 User Management
- **Customer Self-Registration**: Customers can create their own accounts
- **Admin User Creation**: Only administrators can create staff accounts (Manager, Receptionist, Cleaner, Admin)
- **Automated Email Notifications**: New staff receive login credentials via email
- **Complete user profiles** with personal information and profile image upload
- **Secure password management** with change functionality

### 🏠 Room Management
- **CRUD operations** for rooms (Admin only)
- **Room availability tracking** with real-time status
- **Multiple room types**: Single, Double, Suite, Deluxe
- **Room status management**: Available, Occupied, Maintenance
- **Image support** for room galleries

### 📅 Booking System
- **Customer Booking**: Only authenticated customers can create bookings
- **Smart booking creation** with conflict detection
- **Booking status workflow**: Pending → Approved/Rejected → Completed
- **Date validation** and availability checking
- **Booking history** with filtering options
- **Role-based booking management**: Staff can view and manage all bookings

### 🔔 Notification System
- **Real-time in-app notifications** with unread counters
- **Email notifications** for booking events and user creation
- **Notification polling** every 30 seconds
- **Mark as read/unread** functionality

### 📊 Role-Based Dashboards

#### 👥 **Admin Dashboard**
- **Comprehensive analytics** with interactive charts
- **User management**: Create staff accounts with role assignment
- **Real-time statistics**: rooms, bookings, occupancy rates
- **Recent bookings management** with quick actions
- **Full system control**

#### 👨‍💼 **Manager Dashboard**
- **Performance analytics** and monitoring
- **Revenue tracking** and booking trends
- **Staff activity oversight**
- **Read-only system configurations**

#### 🛎️ **Receptionist Dashboard**
- **Guest booking management**
- **Check-in/check-out processing**
- **Booking approval workflow**
- **Guest information access**

#### 🧹 **Cleaner Dashboard**
- **Assigned room cleaning tasks**
- **Task status updates** (Pending → In Progress → Completed)
- **Room maintenance reporting**
- **Personal task tracking**

#### 🏠 **Customer Interface**
- **Room browsing** with advanced filtering
- **Booking creation** and management
- **Personal booking history**
- **Profile management**

### 🎨 Modern UI/UX
- **Dark/Light mode toggle** with system preference detection
- **Fully responsive design** (mobile, tablet, desktop)
- **Professional styling** with Tailwind CSS
- **Smooth animations** and micro-interactions
- **Accessible design** with proper contrast ratios

## 🛠️ Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Spring Mail** for email notifications
- **Swagger/OpenAPI** for API documentation
- **Maven** for dependency management

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Database
- **PostgreSQL** for data persistence
- **JPA/Hibernate** for ORM
- **Automatic schema generation**

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 12+**
- **Maven 3.6+**

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd havenhub
```

2. **Configure PostgreSQL**
```sql
CREATE DATABASE havenhub;
CREATE USER elissa WITH PASSWORD 'elissa';
GRANT ALL PRIVILEGES ON DATABASE havenhub TO elissa;
```

3. **Configure application properties**
```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/havenhub
spring.datasource.username=elissa
spring.datasource.password=elissa

# Email configuration (required for user creation notifications)
spring.mail.host=smtp.gmail.com
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

4. **Run the backend**
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, access the Swagger UI at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

### Key API Endpoints

#### Authentication
- `POST /auth/login` - User login (all roles)
- `POST /auth/register` - Customer self-registration
- `POST /auth/admin/create-user` - Admin creates staff accounts

#### Bookings
- `GET /bookings` - View all bookings (Admin/Manager/Receptionist)
- `GET /bookings/my` - Customer's personal bookings
- `POST /bookings` - Create booking (Customer only)
- `PUT /bookings/{id}/status` - Update booking status (Staff only)

#### Rooms
- `GET /rooms` - View all rooms (public)
- `POST /rooms` - Create room (Admin only)
- `PUT /rooms/{id}` - Update room (Admin only)
- `DELETE /rooms/{id}` - Delete room (Admin only)

## 🔑 Default Admin Account

### System Administrator
- **Email**: `admin@havenhub.com`
- **Password**: `admin123`

**Note**: This is the only pre-created account. All other users must be:
- **Customers**: Self-register through the frontend
- **Staff**: Created by administrators through the admin dashboard

## 🔐 User Account Management

### Customer Registration
- Customers can register themselves using the `/auth/register` endpoint
- Only CUSTOMER role is assigned through self-registration
- Immediate access to booking functionality after registration

### Staff Account Creation
- **Only administrators** can create staff accounts
- Available roles: Manager, Receptionist, Cleaner, Admin
- **Automated process**:
    1. Admin fills out user details and selects role
    2. System generates secure random password
    3. Account is created with specified role
    4. Email sent to new user with login credentials
    5. User prompted to change password on first login

### Email Notifications
Staff account creation triggers automatic email containing:
- Login email address
- Generated password
- Assigned role
- Login URL
- Instructions to change password

## 📁 Project Structure

```
havenhub/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/havenhub/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST controllers
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── security/    # Security configuration
│   │       └── service/     # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🎯 Role-Based Access Control

### Access Permissions

| Feature | Customer | Cleaner | Receptionist | Manager | Admin |
|---------|----------|---------|--------------|---------|-------|
| Self Registration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Bookings | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Own Bookings | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Bookings | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Bookings | ❌ | ❌ | ✅ | ✅ | ✅ |
| Cleaning Tasks | ❌ | ✅ | ❌ | ❌ | ❌ |
| Analytics Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Room Management | ❌ | ❌ | ❌ | ❌ | ✅ |
| User Creation | ❌ | ❌ | ❌ | ❌ | ✅ |

### Navigation & Redirects
After login, users are automatically redirected based on their role:
- **Customer** → `/rooms` (booking interface)
- **Cleaner** → `/cleaner` (cleaning dashboard)
- **Receptionist** → `/receptionist` (booking management)
- **Manager** → `/manager` (analytics dashboard)
- **Admin** → `/admin` (full admin dashboard)

## 🔧 Configuration Options

### Email Settings
Email notifications require SMTP configuration:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=sibomanaelissa71@gmail.com
spring.mail.password=wdhapdculcihbvnk
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Security Settings
```properties
# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000  # 24 hours

# File Upload
spring.servlet.multipart.max-file-size=10MB
file.upload-dir=uploads
```

## 🚀 Deployment

### Backend Deployment
1. **Build the application**
```bash
mvn clean package
```

2. **Run the JAR file**
```bash
java -jar target/havenhub-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
1. **Build for production**
```bash
npm run build
```

2. **Serve the build files** using any static file server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spring Boot** for the robust backend framework
- **React** for the dynamic frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **PostgreSQL** for reliable data storage
- **Recharts** for beautiful data visualizations

---

**HavenHub** - Professional hotel management with role-based access control and automated workflows. 🏨✨
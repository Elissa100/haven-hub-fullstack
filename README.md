# 🏨 HavenHub - Hotel Booking Management System

A comprehensive full-stack hotel booking management system built with **Spring Boot** (backend) and **React.js** (frontend). HavenHub provides a modern, responsive interface for hotel management with role-based access control, real-time notifications, and advanced booking features.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Multi-role system**: Admin, Customer, Manager, Receptionist, Cleaner
- **Role-based access control** with protected routes
- **User registration and login** with validation

### 👤 User Management
- **Complete user profiles** with personal information
- **Profile image upload** with file validation
- **Password change** functionality
- **User activity tracking**

### 🏠 Room Management
- **CRUD operations** for rooms (Admin only)
- **Room availability tracking** with real-time status
- **Multiple room types**: Single, Double, Suite, Deluxe
- **Room status management**: Available, Occupied, Maintenance
- **Image support** for room galleries

### 📅 Booking System
- **Smart booking creation** with conflict detection
- **Booking status workflow**: Pending → Approved/Rejected → Completed
- **Date validation** and availability checking
- **Booking history** with filtering options
- **Automatic room locking** for pending/approved bookings

### 🔔 Notification System
- **Real-time in-app notifications** with unread counters
- **Email notifications** for booking events
- **Notification polling** every 30 seconds
- **Mark as read/unread** functionality

### 📊 Admin Dashboard
- **Comprehensive analytics** with interactive charts
- **Real-time statistics**: rooms, bookings, occupancy rates
- **Recent bookings management** with quick actions
- **Responsive design** for all devices
- **Visual data representation** using Recharts

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

# Optional: Configure email settings
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

## 🔑 Default Credentials

### Admin Account
- **Email**: `admin@havenhub.com`
- **Password**: `admin123`

### Test Customer
Register a new account through the frontend registration form.

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

## 🎯 Key Features Explained

### Role-Based Access Control
- **Admin/Manager**: Full system access, room management, all bookings
- **Receptionist**: View bookings, update booking statuses
- **Cleaner**: View assigned rooms, update cleaning status
- **Customer**: Personal bookings and profile management

### Smart Booking System
- **Conflict Detection**: Prevents double-booking of rooms
- **Status Workflow**: Automated status transitions
- **Email Integration**: Automatic notifications for all booking events
- **Real-time Updates**: Instant UI updates for booking changes

### Advanced Dashboard
- **Interactive Charts**: Room status distribution, booking trends
- **Real-time Stats**: Live occupancy rates and system metrics
- **Quick Actions**: Direct access to common admin tasks
- **Responsive Design**: Optimized for all screen sizes

## 🔧 Configuration Options

### File Upload
- **Profile Images**: Stored in `uploads/profile_pictures/`
- **Max File Size**: 10MB
- **Supported Formats**: JPG, PNG, GIF

### Email Notifications
- **SMTP Configuration**: Gmail, Outlook, or custom SMTP
- **Templates**: Customizable email templates
- **Events**: Booking creation, status updates, cancellations

### Security
- **JWT Expiration**: 24 hours (configurable)
- **Password Encryption**: BCrypt with salt
- **CORS**: Configured for frontend domain

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

**HavenHub** - Making hotel management simple, efficient, and modern. 🏨✨
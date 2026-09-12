# Architecture Documentation

High-level system architecture and design patterns for the Event Planner App.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Web Browser)  │  Mobile App (Future)            │
│  - User Interface              │  - Native/React Native          │
│  - State Management (Redux)    │  - Mobile-specific UX           │
│  - HTTP Client (Axios)         │                                 │
└────────────────┬────────────────────────────────┬────────────────┘
                 │                                │
                 │ HTTPS / REST API               │
                 ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  - Request Routing                                              │
│  - Rate Limiting                                                │
│  - CORS Handling                                                │
│  - Request Validation                                           │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Node.js / Express Server                                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Routes      │  │  Middleware  │  │  Controllers │          │
│  │              │  │              │  │              │          │
│  │- Auth        │  │- JWT Auth    │  │- Event Logic │          │
│  │- Events      │  │- Validation  │  │- Vendor Mgmt │          │
│  │- Vendors     │  │- Error       │  │- Booking     │          │
│  │- Bookings    │  │  Handling    │  │- Budget      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Services Layer                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ Event    │ │ Vendor   │ │ Booking  │ │ User     │    │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Models / ORM Layer                          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ User     │ │ Event    │ │ Vendor   │ │ Booking  │    │  │
│  │  │ Model    │ │ Model    │ │ Model    │ │ Model    │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────┬──────────────┬──────────────┬──────────────┬───────────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐
│  PostgreSQL  │  │    Redis     │  │  File Svc    │  │  Email  │
│  Database    │  │    Cache     │  │  (S3 AWS)    │  │ Service │
└──────────────┘  └──────────────┘  └──────────────┘  └─────────┘
```

## Folder Structure

```
event-planner-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # Database connection config
│   │   │   ├── auth.js               # Authentication config
│   │   │   └── constants.js          # App constants
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── eventController.js
│   │   │   ├── vendorController.js
│   │   │   ├── bookingController.js
│   │   │   ├── budgetController.js
│   │   │   ├── checklistController.js
│   │   │   └── notificationController.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Vendor.js
│   │   │   ├── VendorService.js
│   │   │   ├── Event.js
│   │   │   ├── Budget.js
│   │   │   ├── BudgetCategory.js
│   │   │   ├── Expense.js
│   │   │   ├── Checklist.js
│   │   │   ├── Booking.js
│   │   │   ├── Review.js
│   │   │   ├── Notification.js
│   │   │   ├── Message.js
│   │   │   └── VendorPhoto.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── events.js
│   │   │   ├── vendors.js
│   │   │   ├── bookings.js
│   │   │   ├── budget.js
│   │   │   ├── checklist.js
│   │   │   └── notifications.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── validation.js         # Input validation
│   │   │   ├── errorHandler.js       # Global error handling
│   │   │   ├── logging.js            # Request logging
│   │   │   └── rateLimiter.js        # Rate limiting
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── UserService.js
│   │   │   ├── EventService.js
│   │   │   ├── VendorService.js
│   │   │   ├── BookingService.js
│   │   │   ├── BudgetService.js
│   │   │   ├── ChecklistService.js
│   │   │   ├── NotificationService.js
│   │   │   ├── EmailService.js
│   │   │   ├── FileUploadService.js
│   │   │   └── SearchService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js                # JWT token utilities
│   │   │   ├── password.js           # Password hashing
│   │   │   ├── validators.js         # Validation rules
│   │   │   ├── formatters.js         # Response formatting
│   │   │   └── helpers.js            # Helper functions
│   │   │
│   │   └── server.js                 # Express app entry point
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── services.test.js
│   │   │   ├── models.test.js
│   │   │   └── utils.test.js
│   │   │
│   │   ├── integration/
│   │   │   ├── auth.test.js
│   │   │   ├── events.test.js
│   │   │   ├── vendors.test.js
│   │   │   └── bookings.test.js
│   │   │
│   │   └── fixtures/
│   │       └── seedData.js
│   │
│   ├── migrations/
│   │   ├── 001_create_users_table.js
│   │   ├── 002_create_events_table.js
│   │   ├── 003_create_vendors_table.js
│   │   └── ...
│   │
│   ├── seeders/
│   │   ├── seedUsers.js
│   │   ├── seedVendors.js
│   │   └── seedEvents.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Modal.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── UserTypeSelector.jsx
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── EventList.jsx
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── EventForm.jsx
│   │   │   │   └── EventDetails.jsx
│   │   │   │
│   │   │   ├── vendors/
│   │   │   │   ├── VendorGrid.jsx
│   │   │   │   ├── VendorCard.jsx
│   │   │   │   ├── VendorProfile.jsx
│   │   │   │   └── VendorSearch.jsx
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   ├── BudgetTracker.jsx
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   └── BudgetBreakdown.jsx
│   │   │   │
│   │   │   ├── checklist/
│   │   │   │   ├── ChecklistView.jsx
│   │   │   │   ├── ChecklistItem.jsx
│   │   │   │   └── AddTaskForm.jsx
│   │   │   │
│   │   │   └── bookings/
│   │   │       ├── BookingRequest.jsx
│   │   │       ├── BookingList.jsx
│   │   │       └── BookingDetails.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── VendorsPage.jsx
│   │   │   ├── BookingsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js              # Redux store config
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── eventSlice.js
│   │   │   │   ├── vendorSlice.js
│   │   │   │   ├── bookingSlice.js
│   │   │   │   ├── budgetSlice.js
│   │   │   │   └── notificationSlice.js
│   │   │   │
│   │   │   └── selectors/
│   │   │       ├── authSelectors.js
│   │   │       └── eventSelectors.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance config
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── vendorService.js
│   │   │   ├── bookingService.js
│   │   │   └── uploadService.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useEvent.js
│   │   │   ├── useFetch.js
│   │   │   └── useNotification.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   ├── date.js
│   │   │   └── constants.js
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── tailwind.config.js
│   │   │   └── variables.css
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── database/
│   ├── schema.sql                   # Full database schema
│   ├── migrations/
│   └── seeders/
│
├── docs/
│   ├── API.md                       # API Documentation
│   ├── DATABASE.md                  # Database Schema
│   ├── ARCHITECTURE.md              # This file
│   ├── SETUP.md                     # Setup guide
│   └── CONTRIBUTING.md              # Contributing guidelines
│
├── .gitignore
├── .env.example
├── docker-compose.yml               # Docker configuration
├── README.md
└── package.json                     # Root package config
```

## Design Patterns

### 1. MVC Pattern (Backend)
- **Model**: Database models using Sequelize ORM
- **View**: JSON responses via controllers
- **Controller**: Handles request/response logic

### 2. Service Layer Pattern
- Business logic separated into services
- Controllers call services instead of directly accessing models
- Promotes code reuse and testability

### 3. Repository Pattern
- Models act as repositories for database access
- Centralized data access logic
- Easy to swap implementations

### 4. Redux Pattern (Frontend)
- Single source of truth for state
- Actions and reducers for state mutations
- Selectors for accessing state

### 5. Custom Hooks (Frontend)
- Reusable component logic
- Encapsulates API calls and state management
- Examples: `useAuth`, `useFetch`, `useEvent`

## Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Enter credentials
       ▼
┌─────────────────────────────────┐
│  Login Form / Register Form      │
└──────┬──────────────────────────┘
       │ 2. Submit credentials
       ▼
┌─────────────────────────────────┐
│  POST /api/auth/login            │
│  POST /api/auth/register         │
└──────┬──────────────────────────┘
       │ 3. Validate & hash password
       ▼
┌─────────────────────────────────┐
│  AuthController                  │
│  → AuthService.login()           │
└──────┬──────────────────────────┘
       │ 4. Query database
       ▼
┌─────────────────────────────────┐
│  User Model (Sequelize)          │
│  → Find user by email            │
└──────┬──────────────────────────┘
       │ 5. Generate JWT token
       ▼
┌─────────────────────────────────┐
│  JWT Service                     │
│  → Create signed token           │
└──────┬──────────────────────────┘
       │ 6. Return token + user data
       ▼
┌─────────────────────────────────┐
│  Frontend Redux Store            │
│  → Save token in localStorage    │
│  → Update auth state             │
└─────────────────────────────────┘
```

## API Request Flow

```
┌────────────────────────────────────────────────────────────┐
│  Client (React)                                            │
│  - Makes HTTP request                                      │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Axios HTTP Client                                         │
│  - Adds Authorization header with JWT                      │
│  - Sets base URL and default headers                       │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Express Server (Node.js)                                  │
│  1. Request reaches server                                 │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Middleware Stack                                          │
│  1. Logging - log request                                  │
│  2. CORS - verify origin                                   │
│  3. Body Parser - parse JSON                               │
│  4. Auth - verify JWT token                                │
│  5. Validation - validate request body                     │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Route Handler                                             │
│  - Match URL to route                                      │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Controller                                                │
│  - Extract data from request                               │
│  - Call service methods                                    │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Service Layer                                             │
│  - Execute business logic                                  │
│  - Call model methods                                      │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Model / ORM (Sequelize)                                   │
│  - Query database                                          │
│  - Transform data                                          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  PostgreSQL Database                                       │
│  - Execute SQL query                                       │
│  - Return results                                          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ (Response flows back up)
┌────────────────────────────────────────────────────────────┐
│  JSON Response                                             │
│  - Status code (200, 201, 400, etc.)                       │
│  - Response body with data/errors                          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Client (React)                                            │
│  - Receive response                                        │
│  - Update Redux state                                      │
│  - Re-render components                                    │
└────────────────────────────────────────────────────────────┘
```

## Data Flow for Event Creation

```
1. User fills event form (frontend)
   ↓
2. Submit form → EventForm component
   ↓
3. Dispatch Redux action → createEvent()
   ↓
4. Call API → eventService.createEvent()
   ↓
5. POST /api/events → Express server
   ↓
6. Route → eventController.createEvent()
   ↓
7. Call service → EventService.createEvent()
   ↓
8. Create model instance → Event.create()
   ↓
9. Sequelize generates SQL INSERT
   ↓
10. PostgreSQL inserts event record
   ↓
11. Response returned to frontend
   ↓
12. Redux state updated with new event
   ↓
13. UI re-renders to show new event
```

## Security Considerations

### Authentication & Authorization
- JWT tokens for stateless authentication
- Passwords hashed with bcrypt
- Role-based access control (organizer vs vendor)
- Token expiration and refresh tokens

### Data Protection
- HTTPS/TLS for all communications
- SQL injection prevention via ORM (Sequelize)
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests

### Database Security
- Environment variables for sensitive config
- Database connection pooling
- Transactions for data consistency
- Regular backups

## Caching Strategy

```
┌─────────────────────────────────────┐
│  Frontend Cache                     │
│  - Redux store                      │
│  - localStorage for auth tokens     │
│  - Component-level state            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Server-Side Cache (Redis)          │
│  - User sessions                    │
│  - Vendor list (popular)            │
│  - Rating aggregates                │
│  - Search results                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Database Query Optimization        │
│  - Indexes on frequently queried columns
│  - Connection pooling               │
│  - Query optimization               │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│  Users                                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  CDN (CloudFront)                            │
│  - Serve static assets                       │
│  - Serve frontend build                      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Load Balancer (ALB)                         │
│  - Distribute traffic                        │
│  - SSL termination                           │
└──────────────────────┬───────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ App Server 1  │ │ App Server 2  │ │ App Server 3  │
│ (Node.js)     │ │ (Node.js)     │ │ (Node.js)     │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        └──────────┬──────────────┬──────────┘
                   ▼              ▼
        ┌──────────────────────────────────┐
        │  Primary Database (PostgreSQL)   │
        │  - Handles writes                │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Replica Database (Read-only)    │
        │  - Handles read queries          │
        └──────────────────────────────────┘

        ┌──────────────────────────────────┐
        │  Redis Cache                     │
        │  - Session store                 │
        │  - Query cache                   │
        └──────────────────────────────────┘

        ┌──────────────────────────────────┐
        │  S3 / File Storage               │
        │  - Profile pictures              │
        │  - Vendor photos                 │
        │  - Receipts                      │
        └──────────────────────────────────┘
```

## Scalability Considerations

1. **Horizontal Scaling**
   - Multiple Node.js app servers
   - Load balancer distribution
   - Stateless architecture with Redis sessions

2. **Database Optimization**
   - Read replicas for read-heavy queries
   - Query indexing
   - Connection pooling
   - Partitioning for large tables

3. **Caching Strategy**
   - Redis for session management
   - HTTP caching headers
   - CDN for static assets

4. **Microservices (Future)**
   - Separate services for notifications
   - Independent email service
   - File upload microservice

## Testing Strategy

### Unit Tests
- Service layer logic
- Model validations
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Service interactions

### E2E Tests (Future)
- Complete user workflows
- Cross-browser testing
- Mobile testing

## Monitoring & Logging

- **Application Logging**: Winston/Morgan
- **Error Tracking**: Sentry
- **Performance Monitoring**: New Relic / DataDog
- **Uptime Monitoring**: StatusPage
- **Log Aggregation**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

**Last Updated**: September 2026

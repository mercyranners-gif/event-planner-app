# API Documentation

Complete REST API endpoints for the Event Planner App.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account (organizer or vendor).

**POST** `/auth/register`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "user_type": "organizer",
  "phone": "+1234567890",
  "location": "New York, NY"
}
```

**Response (201):**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "user_type": "organizer",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login User
Authenticate user and receive JWT token.

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "user_type": "organizer",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Logout User
Invalidate current user session.

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### Get User Profile
Retrieve current user's profile information.

**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "profile_picture": "https://...",
  "bio": "Event organizer",
  "location": "New York, NY",
  "user_type": "organizer"
}
```

---

### Update User Profile
Update current user's profile.

**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "bio": "Professional event organizer",
  "profile_picture": "https://..."
}
```

**Response (200):**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "bio": "Professional event organizer"
}
```

---

## Event Endpoints

### Create Event
Create a new event.

**POST** `/events`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "event_name": "My Wedding",
  "event_type": "wedding",
  "event_date": "2026-12-15",
  "event_time": "18:00:00",
  "location": "New York, NY",
  "expected_guests": 150,
  "budget": 50000,
  "description": "Garden wedding ceremony"
}
```

**Response (201):**
```json
{
  "id": 1,
  "organizer_id": 1,
  "event_name": "My Wedding",
  "event_type": "wedding",
  "event_date": "2026-12-15",
  "location": "New York, NY",
  "expected_guests": 150,
  "budget": 50000,
  "status": "planning",
  "created_at": "2026-09-12T12:00:00Z"
}
```

---

### Get All Events
Retrieve all events for the logged-in organizer.

**GET** `/events`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status`: Filter by status (planning, booked, in_progress, completed, cancelled)
- `event_type`: Filter by event type (wedding, birthday, graduation, baby_shower, corporate)
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "total": 5,
  "limit": 10,
  "offset": 0,
  "events": [
    {
      "id": 1,
      "event_name": "My Wedding",
      "event_type": "wedding",
      "event_date": "2026-12-15",
      "location": "New York, NY",
      "status": "planning",
      "budget": 50000
    }
  ]
}
```

---

### Get Event Details
Retrieve detailed information about a specific event.

**GET** `/events/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "organizer_id": 1,
  "event_name": "My Wedding",
  "event_type": "wedding",
  "event_date": "2026-12-15",
  "event_time": "18:00:00",
  "location": "New York, NY",
  "expected_guests": 150,
  "budget": 50000,
  "description": "Garden wedding ceremony",
  "status": "planning",
  "created_at": "2026-09-12T12:00:00Z",
  "updated_at": "2026-09-12T12:00:00Z"
}
```

---

### Update Event
Update an existing event.

**PUT** `/events/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "event_name": "My Wedding",
  "event_date": "2026-12-20",
  "expected_guests": 200,
  "budget": 60000
}
```

**Response (200):**
```json
{
  "id": 1,
  "event_name": "My Wedding",
  "event_date": "2026-12-20",
  "expected_guests": 200,
  "budget": 60000,
  "updated_at": "2026-09-12T13:00:00Z"
}
```

---

### Delete Event
Delete an event.

**DELETE** `/events/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## Budget Endpoints

### Get Budget Summary
Get budget overview for an event.

**GET** `/events/:id/budget`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "event_id": 1,
  "total_budget": 50000,
  "spent_amount": 15000,
  "remaining_budget": 35000,
  "currency": "USD",
  "categories": [
    {
      "id": 1,
      "category_name": "Venue",
      "allocated_amount": 15000,
      "spent_amount": 10000
    }
  ]
}
```

---

### Add Expense
Add an expense to an event budget.

**POST** `/events/:id/expenses`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "category_id": 1,
  "description": "Venue Deposit",
  "amount": 5000,
  "date": "2026-09-12",
  "vendor_name": "Beautiful Venues Inc",
  "payment_status": "paid"
}
```

**Response (201):**
```json
{
  "id": 1,
  "event_id": 1,
  "category_id": 1,
  "description": "Venue Deposit",
  "amount": 5000,
  "date": "2026-09-12",
  "vendor_name": "Beautiful Venues Inc",
  "payment_status": "paid",
  "created_at": "2026-09-12T12:00:00Z"
}
```

---

### Get All Expenses
Retrieve all expenses for an event.

**GET** `/events/:id/expenses`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "total": 3,
  "expenses": [
    {
      "id": 1,
      "description": "Venue Deposit",
      "amount": 5000,
      "date": "2026-09-12",
      "payment_status": "paid"
    }
  ]
}
```

---

## Checklist Endpoints

### Get Event Checklist
Retrieve checklist items for an event.

**GET** `/events/:id/checklist`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "total": 8,
  "items": [
    {
      "id": 1,
      "task_name": "Book Venue",
      "category": "Venue",
      "due_date": "2026-10-15",
      "priority": "high",
      "is_completed": true,
      "created_at": "2026-09-12T12:00:00Z"
    }
  ]
}
```

---

### Add Checklist Item
Add a new task to event checklist.

**POST** `/events/:id/checklist`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "task_name": "Finalize Guest List",
  "category": "Invitations",
  "due_date": "2026-11-01",
  "priority": "high",
  "notes": "Confirm RSVPs"
}
```

**Response (201):**
```json
{
  "id": 2,
  "event_id": 1,
  "task_name": "Finalize Guest List",
  "category": "Invitations",
  "due_date": "2026-11-01",
  "priority": "high",
  "is_completed": false,
  "created_at": "2026-09-12T12:00:00Z"
}
```

---

### Update Checklist Item
Mark a task as complete or update details.

**PUT** `/checklist/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "is_completed": true,
  "notes": "Venue booked!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "task_name": "Book Venue",
  "is_completed": true,
  "notes": "Venue booked!",
  "updated_at": "2026-09-12T13:00:00Z"
}
```

---

## Vendor Endpoints

### Get All Vendors
Retrieve vendors with filters.

**GET** `/vendors`

**Query Parameters:**
- `category`: Filter by category (photography, catering, decoration, venue, music, makeup)
- `location`: Filter by location
- `min_price`: Minimum price range
- `max_price`: Maximum price range
- `min_rating`: Minimum rating (1-5)
- `search`: Search by name or business

**Response (200):**
```json
{
  "total": 42,
  "limit": 10,
  "offset": 0,
  "vendors": [
    {
      "id": 1,
      "user_id": 5,
      "business_name": "Elite Photography",
      "category": "photography",
      "average_rating": 4.8,
      "total_reviews": 25,
      "price_range": "$2000-$5000",
      "location": "New York, NY",
      "verification_status": "verified"
    }
  ]
}
```

---

### Get Vendor by Category
Get all vendors in a specific category.

**GET** `/vendors/category/:category`

**Query Parameters:**
- `location`: Filter by location
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset

**Response (200):**
```json
{
  "total": 15,
  "category": "photography",
  "vendors": [...]
}
```

---

### Get Vendor Details
Retrieve detailed profile for a specific vendor.

**GET** `/vendors/:id`

**Response (200):**
```json
{
  "id": 1,
  "user_id": 5,
  "business_name": "Elite Photography",
  "category": "photography",
  "description": "Professional wedding and event photography",
  "average_rating": 4.8,
  "total_reviews": 25,
  "price_range": "$2000-$5000",
  "years_experience": 10,
  "service_area": "New York, New Jersey, Connecticut",
  "website": "https://elitephotography.com",
  "verification_status": "verified",
  "services": [
    {
      "id": 1,
      "service_name": "Full Day Wedding Coverage",
      "base_price": 4000,
      "duration_hours": 12
    }
  ],
  "photos": [
    {
      "id": 1,
      "photo_url": "https://...",
      "photo_type": "portfolio"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "review_text": "Outstanding photographer!",
      "organizer": "Sarah Smith"
    }
  ]
}
```

---

## Booking Endpoints

### Request Vendor Service
Send a booking request to a vendor.

**POST** `/bookings`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "event_id": 1,
  "vendor_id": 5,
  "service_id": 1,
  "booking_date": "2026-12-15",
  "booking_time": "10:00:00",
  "notes": "Looking for full-day coverage with second shooter"
}
```

**Response (201):**
```json
{
  "id": 1,
  "event_id": 1,
  "vendor_id": 5,
  "booking_date": "2026-12-15",
  "status": "inquiry",
  "created_at": "2026-09-12T12:00:00Z"
}
```

---

### Get User Bookings
Retrieve all bookings for logged-in user.

**GET** `/bookings`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status`: Filter by status (inquiry, pending, confirmed, completed)
- `limit`: Number of results
- `offset`: Pagination offset

**Response (200):**
```json
{
  "total": 5,
  "bookings": [
    {
      "id": 1,
      "event_id": 1,
      "vendor_name": "Elite Photography",
      "service_name": "Full Day Wedding Coverage",
      "booking_date": "2026-12-15",
      "status": "confirmed",
      "quote_amount": 4000
    }
  ]
}
```

---

### Get Booking Details
Retrieve detailed information about a specific booking.

**GET** `/bookings/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "event_id": 1,
  "vendor_id": 5,
  "organizer_id": 1,
  "service_id": 1,
  "booking_date": "2026-12-15",
  "booking_time": "10:00:00",
  "status": "confirmed",
  "quote_amount": 4000,
  "deposit_amount": 1000,
  "final_amount": 4000,
  "payment_status": "deposit_paid",
  "notes": "Full-day coverage with second shooter",
  "vendor": {
    "business_name": "Elite Photography",
    "contact_phone": "+1234567890"
  }
}
```

---

### Update Booking Status
Update booking status (for vendors to respond to inquiries).

**PUT** `/bookings/:id/status`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "confirmed",
  "quote_amount": 4000,
  "deposit_amount": 1000,
  "notes": "We're available and excited to work with you!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "confirmed",
  "quote_amount": 4000,
  "deposit_amount": 1000,
  "updated_at": "2026-09-12T13:00:00Z"
}
```

---

### Cancel Booking
Cancel a booking.

**DELETE** `/bookings/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Booking cancelled successfully"
}
```

---

## Review Endpoints

### Add Review
Leave a review for a completed booking.

**POST** `/bookings/:id/review`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "rating": 5,
  "review_text": "Absolutely amazing photographer! Captured our special day perfectly.",
  "would_recommend": true
}
```

**Response (201):**
```json
{
  "id": 1,
  "booking_id": 1,
  "vendor_id": 5,
  "rating": 5,
  "review_text": "Absolutely amazing photographer!",
  "would_recommend": true,
  "created_at": "2026-09-12T12:00:00Z"
}
```

---

## Notification Endpoints

### Get User Notifications
Retrieve all notifications for logged-in user.

**GET** `/notifications`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `is_read`: Filter by read status (true/false)
- `limit`: Number of results
- `offset`: Pagination offset

**Response (200):**
```json
{
  "total": 5,
  "notifications": [
    {
      "id": 1,
      "notification_type": "booking_confirmed",
      "title": "Booking Confirmed",
      "message": "Your photography booking for My Wedding has been confirmed!",
      "is_read": false,
      "created_at": "2026-09-12T12:00:00Z"
    }
  ]
}
```

---

### Mark Notification as Read
Mark a notification as read.

**PUT** `/notifications/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "is_read": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "is_read": true,
  "updated_at": "2026-09-12T13:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request body",
  "details": {
    "field": "email",
    "message": "Email must be valid"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

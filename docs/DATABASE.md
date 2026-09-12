# Database Schema

This document outlines the database structure for the Event Planner App.

## Tables Overview

### 1. Users
Stores information about all users (Event Organizers and Service Providers).

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type ENUM('organizer', 'vendor') NOT NULL,
  phone VARCHAR(20),
  profile_picture VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 2. Vendors
Extended profile information for service providers.

```sql
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  price_range VARCHAR(50),
  years_experience INT,
  service_area VARCHAR(255),
  website VARCHAR(255),
  social_media_links JSON,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Vendor_Services
Detailed list of services provided by each vendor.

```sql
CREATE TABLE vendor_services (
  id SERIAL PRIMARY KEY,
  vendor_id INT NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  price_currency VARCHAR(3) DEFAULT 'USD',
  duration_hours INT,
  package_details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);
```

### 4. Vendor_Photos
Photo gallery for vendor profiles.

```sql
CREATE TABLE vendor_photos (
  id SERIAL PRIMARY KEY,
  vendor_id INT NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  photo_type ENUM('profile', 'portfolio', 'work_sample') DEFAULT 'portfolio',
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);
```

### 5. Events
Event information created by organizers.

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  organizer_id INT NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255) NOT NULL,
  expected_guests INT,
  description TEXT,
  budget DECIMAL(12,2),
  budget_currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('planning', 'booked', 'in_progress', 'completed', 'cancelled') DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6. Budget
Tracks overall budget and expenses for events.

```sql
CREATE TABLE budget (
  id SERIAL PRIMARY KEY,
  event_id INT UNIQUE NOT NULL,
  total_budget DECIMAL(12,2) NOT NULL,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  remaining_budget DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

### 7. Budget_Categories
Breakdown of budget by category.

```sql
CREATE TABLE budget_categories (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  allocated_amount DECIMAL(12,2),
  spent_amount DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

### 8. Expenses
Individual expense entries for an event.

```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  category_id INT,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  vendor_name VARCHAR(255),
  payment_status ENUM('pending', 'paid', 'partial') DEFAULT 'pending',
  receipt_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES budget_categories(id) ON DELETE SET NULL
);
```

### 9. Checklist
Event planning checklist tasks.

```sql
CREATE TABLE checklist (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  due_date DATE,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT FALSE,
  assigned_to INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

### 10. Bookings
Service booking requests from organizers to vendors.

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  vendor_id INT NOT NULL,
  service_id INT NOT NULL,
  organizer_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME,
  status ENUM('inquiry', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled') DEFAULT 'inquiry',
  quote_amount DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  final_amount DECIMAL(10,2),
  payment_status ENUM('pending', 'deposit_paid', 'fully_paid') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES vendor_services(id) ON DELETE CASCADE,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 11. Reviews
Ratings and reviews from organizers to vendors.

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL,
  vendor_id INT NOT NULL,
  organizer_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 12. Notifications
User notifications for events, tasks, and bookings.

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_event_id INT,
  related_booking_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);
```

### 13. Messages
Direct messaging between organizers and vendors.

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  booking_id INT,
  message_text TEXT NOT NULL,
  attachments JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);
```

## Relationships Diagram

```
users (1) -------- (1) vendors
  |                   |
  |                   |--- (1) vendor_services
  |                   |--- (1) vendor_photos
  |                   |
  |                   (1) --- (M) reviews
  |
  |--- (1) events
        |
        |--- (1) budget
        |--- (M) budget_categories
        |--- (M) expenses
        |--- (M) checklist
        |--- (M) bookings -----(1) vendors
        |--- (M) notifications
        |--- (M) messages
```

## Indexes for Performance

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_verification ON vendors(verification_status);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_checklist_event_id ON checklist(event_id);
CREATE INDEX idx_expenses_event_id ON expenses(event_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
```

## Notes
- All timestamps use UTC timezone
- Currency is tracked per transaction
- Soft deletes could be implemented by adding an `is_deleted` column if needed
- Photos/attachments paths stored as URLs (consider cloud storage like S3)

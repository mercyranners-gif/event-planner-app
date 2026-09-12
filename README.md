# Event Planner App

A comprehensive platform connecting event organizers with service providers. Users can plan events, manage budgets, track checklists, and discover vendors all in one place.

## Overview

**Event Planner App** helps users organize and plan various types of events (weddings, birthdays, graduations, baby showers, corporate events) by connecting them with verified service providers like photographers, decorators, caterers, venues, DJs, and makeup artists.

### Key Users
- **Event Organizers**: Plan events, manage budgets, hire vendors
- **Service Providers/Vendors**: Showcase services, manage bookings, connect with organizers

## Features

### For Event Organizers
- ✅ User registration and profile management
- ✅ Create and manage multiple events
- ✅ Set event details (name, type, date, location, guest count, budget)
- ✅ Budget tracking and expense management
- ✅ Event checklist with task tracking
- ✅ Search and filter vendors by category, location, and price
- ✅ View vendor profiles with reviews and ratings
- ✅ Contact vendors and request services
- ✅ Receive notifications for events, tasks, and bookings

### For Service Providers
- ✅ Create vendor profiles
- ✅ Showcase services with photos and descriptions
- ✅ Manage pricing and availability
- ✅ Receive booking requests from organizers
- ✅ View ratings and reviews
- ✅ Manage bookings and inquiries

## Tech Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: Joi

### DevOps & Tools
- **Version Control**: Git/GitHub
- **Package Manager**: npm
- **Environment**: .env configuration
- **Testing**: Jest + Supertest

## Project Structure

```
event-planner-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── schema.sql
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── ARCHITECTURE.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mercyranners-gif/event-planner-app.git
   cd event-planner-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npm run migrate
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm start
   ```

The app will be available at `http://localhost:3000`

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Events (Organizers)
- `GET /api/events` - Get all user events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Budget
- `GET /api/events/:id/budget` - Get budget details
- `POST /api/events/:id/expenses` - Add expense
- `GET /api/events/:id/expenses` - Get all expenses

### Checklists
- `GET /api/events/:id/checklist` - Get event checklist
- `POST /api/events/:id/checklist` - Add checklist item
- `PUT /api/checklist/:id` - Update checklist item

### Vendors
- `GET /api/vendors` - Get all vendors (with filters)
- `GET /api/vendors/:id` - Get vendor details
- `GET /api/vendors/category/:category` - Get vendors by category

### Bookings
- `POST /api/bookings` - Request vendor service
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

## Database Schema

See [DATABASE.md](./docs/DATABASE.md) for detailed schema information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.

---

**Last Updated**: September 2026

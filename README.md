# Finance Data Processing and Access Control Backend

Backend assignment project for a role-based finance dashboard system.

## Submission Details
- Repository: https://github.com/Hverma1206/zorvyn_assignment
- Default branch: master
- Working branch used during development: master
- Deployed API: Not deployed (local development setup)

## Assignment Coverage Summary
This implementation is designed to directly match the assignment requirements:

1. User and role management
- User creation and user listing (admin only)
- Role updates (admin only)
- Active/inactive status updates (admin only)
- Roles implemented: viewer, analyst, admin

2. Financial records management
- Create, read, update, delete endpoints
- Record filters: type, category, startDate, endDate
- Search support over category/description
- Pagination support
- Soft delete support

3. Dashboard analytics
- Summary endpoint (income, expense, balance, recent records)
- Category-wise aggregation endpoint
- Monthly trends endpoint

4. Access control
- JWT authentication middleware
- Role-based guard middleware
- Strict route-level authorization by role

5. Validation and error handling
- Request validation with Zod schemas
- Centralized global error handler
- Consistent error format

6. Data persistence
- MongoDB with Mongoose models

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Zod (validation)
- JSON Web Token (authentication)
- bcryptjs (password hashing)
- Helmet + CORS (basic security middleware)

## Project Structure
```text
.
├── server.js
├── package.json
├── .env
└── src
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── recordController.js
    │   └── userController.js
    ├── middleware
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── roleGuard.js
    ├── models
    │   ├── Record.js
    │   └── User.js
    ├── routes
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── recordRoutes.js
    │   └── userRoutes.js
    ├── schemas
    │   ├── recordSchema.js
    │   └── userSchema.js
    ├── services
    │   ├── dashboardService.js
    │   ├── recordService.js
    │   └── userService.js
    └── utils
        ├── appError.js
        ├── asyncHandler.js
        ├── jwt.js
        └── pagination.js
```

## Role Access Matrix
| Action | Viewer | Analyst | Admin |
|---|---:|---:|---:|
| Dashboard summary/categories/trends | Yes | Yes | Yes |
| View records | No | Yes | Yes |
| Create/update/delete records | No | No | Yes |
| Create/manage users | No | No | Yes |

## Core Data Models
### User
- username (unique)
- email (unique)
- password (hashed)
- role: viewer | analyst | admin
- isActive: boolean

### Record
- amount
- type: income | expense
- category
- date
- description
- isDeleted (soft delete)
- deletedAt

## Authentication
- JWT-based auth
- Register endpoint creates users as viewer by default
- Bearer token required for protected routes

Header format:
```http
Authorization: Bearer <token>
```

## API Endpoints
Base URL: http://localhost:8000/api

### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

### Users (Admin only)
- POST /users
- GET /users
- PATCH /users/:id/role
- PATCH /users/:id/status

### Records
- GET /records (analyst, admin)
- GET /records/:id (analyst, admin)
- POST /records (admin)
- PUT /records/:id (admin)
- DELETE /records/:id (admin)

### Dashboard
- GET /dashboard (viewer, analyst, admin)
- GET /dashboard/categories (viewer, analyst, admin)
- GET /dashboard/trends (viewer, analyst, admin)

## Records Filtering and Pagination
GET /records query parameters:
- type: income or expense
- category: string
- search: string
- startDate: valid date string
- endDate: valid date string
- page: integer >= 1
- limit: integer (1 to 100)

Response shape:
```json
{
  "data": [],
  "page": 1,
  "totalPages": 1,
  "totalRecords": 0
}
```

## Dashboard Responses
### GET /dashboard/categories
Returns total amount grouped by category.

### GET /dashboard/trends
Returns monthly income vs expense trend in this format:
```json
[
  { "month": "Jan", "income": 10000, "expense": 8000 }
]
```

## Error Handling Format
Global error middleware returns:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Environment Variables
Create a .env file:
```env
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret>
JWT_EXPIRES_IN=7d
```

## How To Run Locally
1. Install dependencies
```bash
npm install
```

2. Add environment variables in .env

3. Start server
```bash
npm start
```

4. Verify health endpoint
```bash
curl http://localhost:8000/
```

## Quick Manual API Test (curl)
```bash
# Register viewer
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"viewer1","email":"viewer1@example.com","password":"password123"}'

# Login (example admin account)
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Assumptions and Tradeoffs
- This project uses MongoDB for persistence and assumes DB availability via MONGO_URI.
- Register endpoint intentionally defaults role to viewer for safety.
- DELETE /records performs soft delete instead of physical deletion.
- API docs are maintained in this README rather than Swagger/OpenAPI in this version.

## Optional Enhancements Status
Implemented:
- JWT authentication
- Pagination
- Search support
- Soft delete

Not implemented in this version:
- Rate limiting middleware wiring
- Automated unit/integration tests
- Deployment URL

## Evaluation Readiness Notes
This submission emphasizes:
- Clear separation of concerns (routes, controllers, services, models)
- Role-based access control with strict route guards
- Input validation and centralized error handling
- Aggregation-heavy analytics APIs for dashboard use

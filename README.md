# Scan Records API

A robust RESTful API service for managing scan records with authentication, logging, and database persistence.

## Features

- 🔐 JWT-based authentication
- 📝 Comprehensive logging system with rotation
- 🗄️ PostgreSQL database with Sequelize ORM
- 🔄 Connection pooling for scalability
- ✅ Input validation
- 📊 Error handling and monitoring
- 🔍 Detailed request logging
- 📈 Database connection health checks

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd scan-records-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scan_records_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

4. Initialize the database:
```bash
npm run db:sync
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Public Routes
- `POST /api/login` - Authenticate user and get JWT token

### Protected Routes (Requires Authentication)
- `GET /api/scan-records` - Get all scan records
- `POST /api/scan-records` - Create a new scan record
- `GET /api/scan-records/:id` - Get a specific scan record
- `PUT /api/scan-records/:id` - Update a scan record
- `DELETE /api/scan-records/:id` - Delete a scan record

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Obtain a token through the login endpoint
2. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Testing Scenarios

### 1. Authentication Testing
```bash
# Login with valid credentials
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Access protected route with token
curl -X GET http://localhost:3000/api/scan-records \
  -H "Authorization: Bearer <your_token>"
```

### 2. Scan Records Operations
```bash
# Create a new scan record
curl -X POST http://localhost:3000/api/scan-records \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"scanData": {"type": "barcode", "value": "123456789"}}'

# Retrieve scan records
curl -X GET http://localhost:3000/api/scan-records \
  -H "Authorization: Bearer <your_token>"
```

## Error Handling

The API implements comprehensive error handling:
- Input validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Resource not found (404)
- Server errors (500)

All errors are logged with request IDs for tracking and debugging.

## Logging

Logs are stored in the `logs` directory with daily rotation:
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs

## Development

Start the development server with hot reload:
```bash
npm run dev
```

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in `.env`
2. Configure proper SSL settings in database.js
3. Use a process manager like PM2
4. Set up proper monitoring and logging services

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

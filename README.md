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

### Postman Collection Setup

1. Create a new Postman Collection named "Scan Records API"
2. Set up a Collection Variable:
   - Click on the collection
   - Go to Variables tab
   - Add a variable named `base_url` with initial value `http://localhost:3000`
   - Add a variable named `token` (this will store the JWT token)

### 1. Authentication Testing

#### Login Request
- Method: `POST`
- URL: `{{base_url}}/api/login`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```
- Tests (Add in Tests tab):
  ```javascript
  // Save the token
  if (pm.response.code === 200) {
      pm.collectionVariables.set("token", pm.response.json().token);
  }
  
  // Test response
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Response has token", function () {
      pm.expect(pm.response.json()).to.have.property('token');
  });
  ```

### 2. Scan Records Operations

#### Create Scan Record
- Method: `POST`
- URL: `{{base_url}}/api/scan-records`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{token}}
  ```
- Body (raw JSON):
  ```json
  {
    "scanData": {
      "type": "barcode",
      "value": "123456789",
      "timestamp": "2024-02-17T12:00:00Z",
      "location": "Warehouse A"
    }
  }
  ```
- Tests:
  ```javascript
  pm.test("Status code is 201", function () {
      pm.response.to.have.status(201);
  });
  
  pm.test("Record created successfully", function () {
      pm.expect(pm.response.json()).to.have.property('id');
      pm.expect(pm.response.json().scanData.value).to.eql("123456789");
  });
  ```

#### Get All Scan Records
- Method: `GET`
- URL: `{{base_url}}/api/scan-records`
- Headers:
  ```
  Authorization: Bearer {{token}}
  ```
- Tests:
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Response is an array", function () {
      pm.expect(pm.response.json()).to.be.an('array');
  });
  ```

#### Get Single Scan Record
- Method: `GET`
- URL: `{{base_url}}/api/scan-records/:id`
- Headers:
  ```
  Authorization: Bearer {{token}}
  ```
- Tests:
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Record has correct structure", function () {
      pm.expect(pm.response.json()).to.have.property('scanData');
      pm.expect(pm.response.json().scanData).to.have.property('type');
      pm.expect(pm.response.json().scanData).to.have.property('value');
  });
  ```

#### Update Scan Record
- Method: `PUT`
- URL: `{{base_url}}/api/scan-records/:id`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{token}}
  ```
- Body (raw JSON):
  ```json
  {
    "scanData": {
      "type": "barcode",
      "value": "987654321",
      "timestamp": "2024-02-17T13:00:00Z",
      "location": "Warehouse B"
    }
  }
  ```
- Tests:
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Record updated successfully", function () {
      pm.expect(pm.response.json().scanData.value).to.eql("987654321");
  });
  ```

#### Delete Scan Record
- Method: `DELETE`
- URL: `{{base_url}}/api/scan-records/:id`
- Headers:
  ```
  Authorization: Bearer {{token}}
  ```
- Tests:
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  
  pm.test("Deletion confirmation message", function () {
      pm.expect(pm.response.json()).to.have.property('message');
  });
  ```

### Error Testing Scenarios

#### Invalid Authentication
- Method: `POST`
- URL: `{{base_url}}/api/login`
- Body (raw JSON):
  ```json
  {
    "username": "invalid",
    "password": "wrong"
  }
  ```
- Tests:
  ```javascript
  pm.test("Status code is 401", function () {
      pm.response.to.have.status(401);
  });
  ```

#### Invalid Token Access
- Method: `GET`
- URL: `{{base_url}}/api/scan-records`
- Headers:
  ```
  Authorization: Bearer invalid_token
  ```
- Tests:
  ```javascript
  pm.test("Status code is 403", function () {
      pm.response.to.have.status(403);
  });
  ```
  
## PostgreSQL Queries

To interact with the database directly, you can use `psql` command-line tool or any PostgreSQL client (e.g., pgAdmin, DBeaver).

### Connect to Database
```bash
psql -h localhost -p 5432 -U your_username -d scan_records_db
```

### Basic Queries

1. View all scan records:
```sql
SELECT * FROM "ScanRecords" ORDER BY "createdAt" DESC;
```

2. Find specific scan record by ID:
```sql
SELECT * FROM "ScanRecords" WHERE id = 'your-uuid-here';
```

3. Get records from a specific date:
```sql
SELECT * FROM "ScanRecords" 
WHERE DATE("createdAt") = '2024-02-17';
```

4. Count records by scan type:
```sql
SELECT "scanData"->>'type' as scan_type, COUNT(*) 
FROM "ScanRecords" 
GROUP BY "scanData"->>'type';
```

5. Find records by location:
```sql
SELECT * FROM "ScanRecords" 
WHERE "scanData"->>'location' = 'Warehouse A';
```

6. Get latest 10 records:
```sql
SELECT * FROM "ScanRecords" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

7. Get failed scans:
```sql
SELECT * FROM "ScanRecords" 
WHERE status = 'failed';
```

Note: Replace `your_username` with your actual PostgreSQL username when connecting to the database.

### Environment Setup Guide

1. Import the collection into Postman
2. Create environments for different setups:
   - Development:
     - `base_url`: `http://localhost:3000`
   - Staging:
     - `base_url`: `https://staging-api.example.com`
   - Production:
     - `base_url`: `https://api.example.com`

3. Run the collection:
   - Use Postman's Collection Runner
   - Select the environment
   - Run tests in sequence (Authentication first)
   - View the test results in the Postman console

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

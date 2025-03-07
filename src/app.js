const express = require('express');
const dotenv = require('dotenv');
const scanRecordsRoutes = require('./routes/scanRecordsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { authenticateToken } = require('./middlewares/authMiddleware');
const scanRecordsController = require('./controllers/scanRecordsController');
const { testConnection } = require('./config/database');
const logger = require('./config/logger');
const { requestLogger, authFailureLogger } = require('./middlewares/loggingMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Add logging middleware
app.use(requestLogger);
app.use(authFailureLogger);

// Middleware to parse JSON bodies
app.use(express.json());

// Test database connection
testConnection();

// Routes
app.use('/api/scan-records', scanRecordsRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes); // Protected upload routes

// Public routes (no authentication required)
app.post('/api/login', scanRecordsController.login);

// Protected routes (authentication required)
// Apply authenticateToken middleware to all scan record routes
app.use('/api/scanrecords', authenticateToken);
app.get('/api/scanrecords', scanRecordsController.getAllScanRecords);
app.post('/api/scanrecords', scanRecordsController.createScanRecord);
app.get('/api/scanrecords/:id', scanRecordsController.getScanRecordById);
app.put('/api/scanrecords/:id', scanRecordsController.updateScanRecord);
app.delete('/api/scanrecords/:id', scanRecordsController.deleteScanRecord);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
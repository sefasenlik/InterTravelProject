const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    // Log the error with full stack trace
    logger.error('Error occurred', {
        requestId: req.requestId,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        requestId: req.requestId, // Include request ID in response for tracking
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
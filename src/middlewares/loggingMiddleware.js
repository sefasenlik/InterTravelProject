const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
    // Generate a unique request ID
    req.requestId = require('crypto').randomUUID();
    
    // Log the incoming request
    logger.info('Incoming request', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Track response time
    const start = Date.now();
    
    // Log the response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

// Middleware to log authentication failures
const authFailureLogger = (req, res, next) => {
    const originalStatus = res.status;
    
    res.status = function(code) {
        if (code === 401 || code === 403) {
            logger.warn('Authentication failure', {
                requestId: req.requestId,
                method: req.method,
                path: req.path,
                statusCode: code,
                ip: req.ip
            });
        }
        return originalStatus.apply(this, arguments);
    };
    
    next();
};

module.exports = { requestLogger, authFailureLogger }; 
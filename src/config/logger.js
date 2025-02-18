const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory and ensure it exists
const logDir = 'logs';

// Define log formats
const formats = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create the logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: formats,
    defaultMeta: { service: 'scan-records-api' },
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        
        // File transport for errors
        new DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '30d', // Keep logs for 30 days
            maxSize: '10m'   // Rotate when size exceeds 10MB
        }),
        
        // File transport for all logs
        new DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '10m'
        })
    ]
});

// Create a stream object for Morgan integration
logger.stream = {
    write: (message) => logger.info(message.trim())
};

// TODO: Future improvements
// 1. Add log aggregation service integration (e.g., ELK Stack, Datadog)
// 2. Implement log rotation based on file size
// 3. Add log compression for archived logs
// 4. Implement real-time log monitoring
// 5. Add metrics collection for monitoring dashboard

module.exports = logger; 
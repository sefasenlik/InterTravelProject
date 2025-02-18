const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance with connection pool
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Connection pool configuration for scalability
  pool: {
    max: 20, // Maximum number of connections in pool
    min: 5,  // Minimum number of connections in pool
    acquire: 30000, // Maximum time (ms) to acquire connection
    idle: 10000    // Maximum time (ms) connection can be idle
  },
  
  // Additional security and performance options
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false // In production, configure proper SSL
    } : false,
    // Add statement timeout to prevent long-running queries
    statement_timeout: 10000
  },
  
  // Logging configuration
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    // Sync all models with database
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit if cannot connect to database
  }
};

// TODO: Implement connection retry logic for better reliability
// TODO: Add metrics collection for monitoring connection pool usage
// TODO: Implement proper connection error handling and recovery
// TODO: Consider implementing read replicas for scaling

module.exports = { sequelize, testConnection }; 
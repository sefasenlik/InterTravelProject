const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ScanRecord = sequelize.define('ScanRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  scanData: {
    type: DataTypes.JSONB, // Using JSONB for flexible schema and better performance
    allowNull: false,
    // Add validation if needed
    validate: {
      notEmpty: true
    }
  },
  // Add metadata fields for better tracking
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'failed'),
    defaultValue: 'pending'
  },
  processedAt: {
    type: DataTypes.DATE
  }
}, {
  // Enable timestamps (createdAt, updatedAt)
  timestamps: true,
  
  // Add indexes for better query performance
  indexes: [
    {
      fields: ['status'], // Index for status queries
    },
    {
      fields: ['createdAt'], // Index for timestamp queries
    }
  ],
  
  // Add hooks for additional processing
  hooks: {
    beforeCreate: (record) => {
      // Add any preprocessing logic here
    },
    afterCreate: (record) => {
      // Add any post-processing logic here
    }
  }
});

// TODO: Implement data partitioning strategy for large datasets
// TODO: Add caching layer for frequently accessed records
// TODO: Implement soft delete functionality
// TODO: Add audit logging for changes
// TODO: Consider implementing versioning for scanData changes

module.exports = { ScanRecord };
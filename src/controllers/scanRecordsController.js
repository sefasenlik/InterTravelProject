const ScanRecord = require('../models/scanRecordsModel').ScanRecord;
const jwt = require('jsonwebtoken');

// Get all scan records
const getAllScanRecords = async (req, res, next) => {
  try {
    // Now we can access the authenticated user's info through req.user
    // You might want to limit records based on user permissions
    const scanRecords = await ScanRecord.findAll({
      // Add pagination for better performance
      limit: 10,
      offset: 0,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(scanRecords);
  } catch (err) {
    next(err);
  }
};

// Get a single scan record by ID
const getScanRecordById = async (req, res, next) => {
  try {
    const scanRecord = await ScanRecord.findByPk(req.params.id);
    if (!scanRecord) {
      return res.status(404).json({ message: 'Scan record not found' });
    }
    res.status(200).json(scanRecord);
  } catch (err) {
    next(err);
  }
};

// Create a new scan record
const createScanRecord = async (req, res, next) => {
  try {
    const newScanRecord = await ScanRecord.create({
      scanData: req.body.scanData,
    });
    res.status(201).json(newScanRecord);
  } catch (err) {
    next(err);
  }
};

// Update a scan record by ID
const updateScanRecord = async (req, res, next) => {
  try {
    const [updated] = await ScanRecord.update(
      { 
        scanData: req.body.scanData,
        updatedAt: Date.now()
      },
      { 
        where: { id: req.params.id },
        returning: true
      }
    );
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Scan record not found' });
    }
    
    const updatedScanRecord = await ScanRecord.findByPk(req.params.id);
    res.status(200).json(updatedScanRecord);
  } catch (err) {
    next(err);
  }
};

// Delete a scan record by ID
const deleteScanRecord = async (req, res, next) => {
  try {
    const deleted = await ScanRecord.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Scan record not found' });
    }
    res.status(200).json({ message: 'Scan record deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Add a login endpoint to generate JWT tokens
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // TODO: Implement proper user authentication
    // This is a simplified example - you should:
    // 1. Validate user credentials against your database
    // 2. Use proper password hashing (bcrypt)
    // 3. Implement proper error handling
    
    if (username === 'admin' && password === 'password') {
      const token = jwt.sign(
        { userId: '123', username: username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.status(200).json({
        message: 'Authentication successful',
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllScanRecords,
  getScanRecordById,
  createScanRecord,
  updateScanRecord,
  deleteScanRecord,
  login
};
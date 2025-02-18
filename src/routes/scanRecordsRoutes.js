const express = require('express');
const { body } = require('express-validator');
const scanRecordsController = require('../controllers/scanRecordsController');
const validateInput = require('../middlewares/validateInput');

const router = express.Router();

// Validation rules for creating/updating a scan record
const scanRecordValidationRules = [
  body('scanData').notEmpty().withMessage('Scan data is required'),
];

// CRUD routes for ScanRecords
router.get('/', scanRecordsController.getAllScanRecords);
router.get('/:id', scanRecordsController.getScanRecordById);
router.post('/', scanRecordValidationRules, validateInput, scanRecordsController.createScanRecord);
router.put('/:id', scanRecordValidationRules, validateInput, scanRecordsController.updateScanRecord);
router.delete('/:id', scanRecordsController.deleteScanRecord);

module.exports = router;
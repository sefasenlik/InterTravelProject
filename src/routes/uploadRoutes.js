const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const router = express.Router();

// Load environment variables for configuration
const BUCKET_NAME = process.env.AWS_BUCKET_NAME; // AWS S3 bucket name
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 100 * 1024 * 1024; // Maximum file size (default 100MB)

// Define allowed file extensions for 3D scan models
const ALLOWED_EXTENSIONS = ['.obj', '.ply', '.stl', '.fbx', '.glb', '.gltf'];

// Configure multer storage to hold files in memory
const storage = multer.memoryStorage();

// Validate file type and size using fileFilter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true);
    } else {
        // Reject file if it's not an allowed 3D file type
        cb(new Error('File type not allowed. Only 3D model file types are permitted.'), false);
    }
};

// Setup multer middleware for handling multipart/form-data uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileFilter
});

// Initialize the AWS S3 client using credentials from environment variables
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Utility function to generate a secure filename to avoid collisions
const generateSecureFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(originalName);
    return `${timestamp}-${randomString}${ext}`;
};

/**
 * POST /api/upload/3d
 * Endpoint to handle large file uploads for 3D scans
 * - Accepts multipart/form-data uploads with a file field named 'model'
 * - Validates file size and allowed file types (.obj, .ply, etc.)
 * - Stores the file in an AWS S3 bucket (simulated integration)
 * 
 * Security and Integrity measures include:
 * - File size check via multer's limits
 * - File type validation via custom fileFilter
 * - Secure filename generation to prevent overwrites
 * - Placeholder for virus scanning or file integrity verification (e.g., checksum validation)
 */
router.post('/3d', upload.single('model'), async (req, res) => {
    try {
        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate a secure filename
        const secureFilename = generateSecureFilename(req.file.originalname);

        // TODO: Integrate virus scanning or checksum verification here if needed
        // Example: const isClean = await performVirusScan(req.file.buffer);
        // if (!isClean) return res.status(400).json({ error: 'File failed security check' });

        // Prepare parameters for uploading to AWS S3
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `3d-uploads/${secureFilename}`, // Save under a directory for organization
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            Metadata: {
                originalName: req.file.originalname,
                uploadTimestamp: new Date().toISOString()
            }
        };

        // Execute the upload command to S3
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Respond with file details on successful upload
        res.status(200).json({
            message: '3D file uploaded successfully',
            filename: secureFilename,
            originalName: req.file.originalname,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({
            error: 'File upload failed',
            details: error.message
        });
    }
});

module.exports = router;

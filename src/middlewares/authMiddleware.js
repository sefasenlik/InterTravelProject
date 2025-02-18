const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user data to request object for use in subsequent middleware/routes
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// TODO: Consider implementing additional security middleware:
// - Rate limiting to prevent brute force attacks
// - IP whitelisting for sensitive operations
// - Request logging for audit trails
// - MFA verification for high-risk operations

module.exports = { authenticateToken }; 
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

const ensureAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token [Bearer, token]

    try {
        console.log('Received Token:', token); // Debugging line
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Debugging line
        req.user = decoded;
        next();// Move to the next middleware
    } catch (error) {
        console.error('JWT Verification Error:', error); // Debugging line
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid' });
    }
};

module.exports = { ensureAuth };

const jwt = require('jsonwebtoken');
require('dotenv').config(); // variables from .env file


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // fatch token 
    const token = req.headers['authorization'];

    // Check token is provided or not
    if (!token) return res.status(401).send('Token is required');

    // Verify the token using JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token'); 
        req.user = user; // add the decoded user info to the request object
        next(); // Proceed to the next middleware or route 
    });
};

module.exports = verifyToken; 

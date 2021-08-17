const jwt = require('jsonwebtoken');

// Decodes Token sent by the request to retrieve user ID 
// Checks if IDs match 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw new Error('403: unauthorized request');
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({
            error: 'Invalid request !'
        });
    }
};

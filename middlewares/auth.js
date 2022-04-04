const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const secret = constants.secret;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuthenticated = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token == false) {
        req.isAuthenticated = false;
        return next();
    }
    let decodedToken;
    try {
     decodedToken = jwt.verify(token, secret);   
    } catch (error) {
        req.isAuthenticated = false;
        return next();
    }
    if(!decodedToken){
        req.isAuthenticated = false;
        return next();
    }
    req.isAuthenticated = true;
    req.username = decodedToken.username;
};
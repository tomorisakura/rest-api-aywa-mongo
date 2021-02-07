require('dotenv').config();
const jwt = require('jsonwebtoken');

class Auth {
    authorization = (req, res, next) => {
        try {
            const token = req.headers['x-access-token'];
            if (typeof token !== 'undefined') {
                const bearer = token.split(' ');
                const bearerToken = bearer[1];
                jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
                    if(err) {
                        res.status(401).send({ message: 'token expired' });
                        res.end();
                        throw err;
                    }
                    req.token = decoded;
                    next();
                });
            } else {
                res.status(403).send({
                    message : 'token must be not null'
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Auth;
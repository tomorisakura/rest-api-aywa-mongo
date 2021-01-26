'use strict';
class Auth {
    authorization = (req, res, next) => {
        try {
            const token = req.header['x-access-token'];
            if (typeof token !== 'undefined') {
                const bearer = token.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            } else {
                res.status(403);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Auth;
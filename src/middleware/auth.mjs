import dotenv from 'dotenv';
import Token from '../model/token.mjs';
import { generateAccToken } from '../helpers/generate.mjs';
import jwt from 'jsonwebtoken';
dotenv.config();

export default class Auth {
    authorization = (req, res, next) => {
        try {
            const token = req.headers['x-access-token'];
            if (typeof token !== 'undefined') {
                const bearer = token.split(' ');
                const bearerToken = bearer[1];
                jwt.verify(bearerToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
                    if(err) {
                        res.status(401).send({ message: 'token expired' });
                        throw err;
                    }
                    req.data = decoded;
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

    refreshToken = (req, res) => {
        try {
            const refreshToken = req.body.token;
            if(refreshToken == null) res.status(403).json({ message: 'token is empty' });
            if(typeof refreshToken !== 'undefined') {
                Token.findOne({token : refreshToken})
                .then(result => {
                    jwt.verify(result.token, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
                        if(err) res.status(403);
                        const accToken = generateAccToken({ payload : decoded });
                        res.json({ accToken: accToken });
                    });
                })
                .catch(err => {
                    res.json({ accToken: `Promise err : ${err}` });
                });
            } else {
                res.status(403).json({
                    message : 'token must be not null'
                });
            }
        } catch (error) {
            throw error;
        }
    }
}
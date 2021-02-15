import dotenv from 'dotenv';
import Users from '../model/users.mjs';
import Token from '../model/token.mjs';
import { Uniqname, generateAccToken } from '../helpers/generate.mjs';
import { hashCrypt, compareCrypt } from '../helpers/crypt.mjs';
dotenv.config();

export default class UsersController{
    
     async getUsers(req, res) {
        try {
            const response = await Users.find();
            res.status(200).send({
                method : req.method,
                status : true,
                code : 200,
                results : response
            });
        } catch (error) {
            throw error;
        }
    }

    createUsers(req, res) {
        try {
            const name = req.body.name;
            const phone = req.body.no_hp;
            const password = req.body.password;
            const username = Uniqname(name, phone);
            const address = req.body.alamat;
            const hash = hashCrypt(password);
            const email = req.body.email;
            const uid = req.body.uid;
            console.log(username);

            const createObj = {
                name : name,
                username : username,
                no_hp : phone,
                alamat : address,
                password : hash,
                email: email,
                uid_auth: uid
            };

            const response = new Users(createObj);
            response.save();

            const accToken = generateAccToken({ payload : response.username });
            res.status(200).send({
                method : req.method,
                status : true,
                code : 200,
                token : `Grevi ${accToken}`,
                results : response
            });
        } catch (error) {
            throw error;
        }
    }

    login(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            return Users.find({
                username : username
            }).then(result => {
                const dbPassword = result[0].password
                const match = compareCrypt(password, dbPassword);
                if(match) {
                    console.log('Login Berhasil');
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'login success',
                        token : 'jwt-token'
                    });
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'login failed, please make sure you remember a password'
                    });
                }
            });

        } catch (error) {
            throw error;
        }
    }

    deleteUser(req, res) {
        try {
            const username = req.params.username;
            return Users.deleteOne({ username : username })
            .then(result => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    message : 'success delete data',
                    result: result
                });
            })
            .catch(err => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 203,
                    message : `Promise err : ${err}`,
                    result: null
                });
            });
        } catch (error) {
            throw error;
        }
    }

    findEmail(req, res) {
        try {
            const email = req.query.email;
            console.log(email);
            Users.findOne({
                email : email
            })
            .then(result => {
                console.log(result);
                if (result !== null) {
                    console.log(`logged ${result.name}`);
                    const accessToken = generateAccToken({ payload: result.username });
                    //const refreshToken = jwt.sign({ payload : result.email }, process.env.REFRESH_TOKEN_KEY);
                    //new Token({ token: refreshToken, role : 'adopter' }).save();
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        token : `Grevi ${accessToken}`,
                        result : result
                    });
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 203,
                        token : null,
                        result : null
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    method : req.method,
                    status : false,
                    code : 203,
                    result: err
                })
            });
        } catch (error) {
            throw error;
        }
    }

}
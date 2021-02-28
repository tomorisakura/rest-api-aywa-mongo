require('dotenv').config();
const Users = require('../model/users');
const Generate = require('../helpers/generate');

class UsersController extends Generate{

    constructor() {
        super();
    }
    
     async get(req, res) {
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

    createUsers = (req, res) => {
        try {
            const name = req.body.name;
            const phone = req.body.no_hp;
            const username = this.generateUsername(name, phone);
            const address = req.body.alamat;
            const email = req.body.email;
            const uid = req.body.uid;
            console.log(username);

            console.log('nda ada');
            const response = new Users({
                name : name,
                username : username,
                no_hp : phone,
                alamat : address,
                email: email,
                uid_auth: uid
            });
            response.save();

            const token = this.generateAccToken({ payload: response.username });
            res.send({
                method : req.method,
                status : true,
                code : 200,
                token : `Grevi ${token}`,
                results : response
            });
        } catch (error) {
            throw error;
        }
    }

    updateUser = (req, res) => {
        try {
            const username = req.params.username;
            const phone = req.body.no_hp;
            const address = req.body.alamat;

            Users.updateOne({ username: username }, { no_hp: phone, alamat: address })
            .then(result => {
                res.status(200).json({ 
                    method : req.method,
                    status : true,
                    code : 200,
                    message : 'success update data',
                    result: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    method : req.method,
                    status : false,
                    code : 404,
                    message : 'failed update data',
                    response : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    login = (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;

            return Users.findOne({
                username : username
            }).then(result => {
                const dbPassword = result.password
                const match = this.compareCript(password, dbPassword);
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
                    message : `success delete data ${result}`
                });
            })
            .catch(err => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 203,
                    message : `failed delete data : ${err}`
                })
            })
        } catch (error) {
            throw error;
        }
    }

    findEmail = (req, res) => {
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
                    const uname = this.generateUsername(result.name, result.no_hp);
                    console.log(uname);
                    const token = this.generateAccToken({ payload: result.username });
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        token : `Grevi ${token}`,
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

module.exports = UsersController;
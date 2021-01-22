const Users = require('../model/users');
const Generate = require('../helpers/generate');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);
const generate = new Generate();

class UsersController{
    
    async get(req, res) {
        try {
            const response = await Users.find();
            return res.send({
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
            const username = generate.Uniqname(name, phone);
            const address = req.body.alamat;
            const hash = bcrypt.hashSync(password, salt);
            const email = req.body.email;
            const uid = req.body.uid;

            console.log(username);

            Users.findOne({
                username : username
            }).then(result => {
                console.log(result);
                if(result) {
                    console.log('ada');
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        result : null
                    })
                } else {
                    console.log('nda ada');
                    const response = new Users({
                        name : name,
                        username : username,
                        no_hp : phone,
                        alamat : address,
                        password : hash,
                        email: email,
                        uid_auth: uid
                    });
        
                    response.save();
        
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        results : response
                    });
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async updateUsers(req, res) {
        try {
            const username = req.params.username;

            return await Users.update({
                username : username
            }, { $set: req.body },
            (err) => {
                if (err) {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'failed update data',
                        response : err
                    })
                } else {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'success update data'
                    })
                }
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
                const match = bcrypt.compareSync(password, dbPassword);
                if(match) {
                    console.log('Login Berhasil');
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'login success',
                        token : 'jwt token'
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

    async deleteUser(req, res) {
        try {
            const username = req.params.username;
            return await Users.deleteOne({
                username : username
            }, (err) => {
                if(err) {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 203,
                        message : 'failed delete data'
                    })
                } else {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'success delete data'
                    })
                }
            })
        } catch (error) {
            throw error;
        }
    }

    findEmail = (req, res) => {
        try {
            const email = req.query.email;

            console.log(email);

            return Users.findOne({
                email : email
            })
            .then(result => {
                if (result !== null) {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        token : 'jwt-token',
                        result : result
                    })
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 203,
                        token : null,
                        result : null
                    })
                }
            })
            .catch(err => {
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
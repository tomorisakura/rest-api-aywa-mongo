const Users = require('../model/users');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const generateUsername = (name, phone) => {
    try {
        const char = name.split(' ');
        const number = phone.split('');
        const arr = [];

        for (let i = 0; i < number.length; i++) {
            if (i > 7) {
                arr.push(number[i]);
            } else if(i === 0) {
                arr.push(char[0]);
            }
        }

        const result = Array.from(arr).join('');
        return result.toLocaleLowerCase();

    } catch (error) {
        throw error;            
    }
}

class UsersController {
    
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
            const username = generateUsername(name, phone);
            const address = req.body.alamat;
            const hash = bcrypt.hashSync(password, salt);

            Users.findOne({
                username : username
            }).then(result => {
                if(result) {
                    console.log('ada');
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'username already exists'
                    })
                } else {
                    const response = new Users({
                        name : name,
                        username : username,
                        no_hp : phone,
                        alamat : address,
                        password : hash
                    });
        
                    response.save();
        
                    return res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        results : response
                    })
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

    

}

module.exports = UsersController;
const Clincs = require('../model/clinics');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Generate = require('../helpers/generate');

const salt = bcrypt.genSaltSync(10);
const generate = new Generate();

class ClincisController{

    async get(req, res) {
        try {
            const response = await Clincs.find();
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            });
        } catch (error) {
            throw error;
        }
    }

    async createClinics(req, res) {
        try {
            const clinic = req.body.name;
            const strv = req.body.strv;
            const phone = req.body.phone;
            const address = req.body.address;
            const email = req.body.email;
            const password = req.body.password;
            const uniqname = generate.Uniqname(clinic, strv);
            const hash = bcrypt.hashSync(password, salt);
            console.log(uniqname);

            Clincs.findOne({
                uniqname : uniqname
            })
            .then(result => {
                if(result) {
                    console.log(result);
                    console.log('ada');

                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'username already exists'
                    });
                } else {
                    console.log(result);
                    console.log('nda ada');

                    const response = new Clincs({
                        clinic_name : clinic,
                        uniqname : uniqname,
                        no_strv : strv,
                        email : email,
                        no_hp : phone,
                        alamat : address,
                        password : hash
                    });
        
                    response.save();
        
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        result : response
                    });
                }
            });


        } catch (error) {
            throw error;
        }
    }

    async updateClinics(req, res) {
        try {
            const uniqname = req.params.uniqname;

            return await Clincs.updateOne({
                uniqname : uniqname,
            }, { $set : req.body },
            (err) => {
                if(err) {
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
                    });
                }
            })
        } catch (error) {
            throw error;
        }
    }

    async login(req, res) {
        try {
            const uniqname = req.body.uniqname;
            const password = req.body.password;

            return await Clincs.find({
                uniqname : uniqname
            }).then(result => {
                const dbPassword = result[0].password;
                const match = bcrypt.compareSync(password, dbPassword);

                if(match) {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'login success',
                        token : 'token'
                    })
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'login failed, password not match',
                        token : null
                    });
                }

            })
            .catch(err => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : 'login failed, password or uniqname not match',
                    err : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(req, res) {
        try {
            const uniqname = req.params.uniqname;
            const email = req.body.email;
            const newPassword = req.body.new_password;
            const hash = bcrypt.hashSync(newPassword, salt);

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'foxie.clinic@gmail.com',
                    pass: 'kyokosakura18'
                }
            });

            let mailOptions = {
                from: 'foxie.clinic@gmail.com',
                to: email,
                subject: 'Reset Password Akun Foxie Clinics',
                text: `Hallo ${uniqname} password akun kamu berhasil diubah, passwordnya : ${newPassword}`
            }

            return await Clincs.updateOne({
                uniqname : uniqname
            }, {password : hash}).then(result => {
                console.log(result);

                transporter.sendMail(mailOptions, (err, response) => {
                    if(err) throw err;
                    console.log(`response : ${response}`);
                });

                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    message : 'success reset password, please check your email'
                })

            }).catch((err) => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : 'uniqname not found !',
                    err : err
                })
            });
                        
        } catch (error) {
            throw error;
        }
    }

     
}

module.exports = ClincisController;
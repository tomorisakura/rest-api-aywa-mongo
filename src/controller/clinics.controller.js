require('dotenv').config();
const Clincs = require('../model/clinics');
const nodemailer = require('nodemailer');
const Generate = require('../helpers/generate');
const smtpTransporter = require('nodemailer-smtp-transport');

class ClincisController extends Generate{

    constructor() {
        super();
    }

    async get(req, res) {
        try {
            const response = await Clincs.find();
            return res.status(200).send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            });
        } catch (error) {
            throw error;
        }
    }

    createClinics = async (req, res) => {
        try {
            const clinic = req.body.name;
            const strv = req.body.strv;
            const phone = req.body.phone;
            const address = req.body.address;
            const email = req.body.email;
            const password = req.body.password;
            const uniqname = this.generateUsername(clinic, strv);
            const hash = this.hashCrypt(password);
            console.log(uniqname);

            const response = await new Clincs({
                clinic_name : clinic,
                uniqname : uniqname,
                no_strv : strv,
                email : email,
                no_hp : phone,
                alamat : address,
                password : hash
            });

            response.save();
            const token = this.generateAccToken({ payload : response.uniqname });
            res.send({
                method : req.method,
                status : true,
                code : 200,
                token: `Grevi ${token}`,
                result : response
            });

        } catch (error) {
            throw error;
        }
    }

    updateClinics(req, res) {
        try {
            const uniqname = req.params.uniqname;

            const phone = req.body.phone;
            const address = req.body.address;

            return Clincs.updateOne({ uniqname : uniqname }, {no_hp : phone, alamat: address})
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
                })
            });
        } catch (error) {
            throw error;
        }
    }

    login = (req, res) => {
        try {
            const uniqname = req.body.uniqname;
            const password = req.body.password;

            return Clincs.find({
                uniqname : uniqname
            }).then(result => {
                const dbPassword = result[0].password;
                const match = this.compareCript(password, dbPassword);
                const token = this.generateAccToken({ payload: result.uniqname });
                if(match) {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'login success',
                        token : `Grevi ${token}`,
                        result : result
                    })
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'login failed, password not match',
                        token : null,
                        result : null
                    });
                }

            })
            .catch(err => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : 'login failed, password or uniqname not match',
                    token : null,
                    result : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    resetPassword = (req, res) => {
        try {
            const uniqname = req.params.uniqname;
            const email = req.body.email;
            const newPassword = req.body.new_password;
            const hash = this.hashCrypt(newPassword);

            let transporter = nodemailer.createTransport(smtpTransporter({
                host: process.env.NODEMAILER_HOST,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                port: 465,
                auth: {
                    user: process.env.NODEMAILER_SMTP,
                    pass: process.env.NODEMAILER_KEY
                }
            }));

            let mailOptions = {
                from: process.env.NODEMAILER_SMTP,
                to: email,
                subject: 'Reset Password Akun Aywa Admin',
                text: `Hallo ${uniqname} password akun kamu berhasil diubah, passwordnya : ${newPassword}`
            }

            return Clincs.updateOne({ uniqname : uniqname }, { password : hash })
            .then(result => {
                console.log(result);

                if (result.nModified === 1) {
                    console.log(hash);
                    transporter.sendMail(mailOptions, (err, response) => {
                        if(err) console.log(err);
                        console.log(`response : ${response}`);
                    });

                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        modified : result.nModified,
                        message : 'Password berhasil diubah !, Silahkan cek email'
                    });
                } else {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        modified : result.nModified,
                        message : 'Username tidak ditemukan !'
                    });
                }
            })
            .catch((err) => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    err : err
                })
            });
                        
        } catch (error) {
            throw error;
        }
    }

    getClinic(req, res) {
        try {
            const uniqname = req.params.uniqname;

            console.log(req.method);

            return Clincs.findOne({
                uniqname : uniqname
            })
            .then((result) => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                }); 
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
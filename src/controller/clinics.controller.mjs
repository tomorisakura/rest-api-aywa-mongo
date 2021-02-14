import dotenv from 'dotenv';
import Clincs from '../model/clinics.mjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import smtpTransporter from 'nodemailer-smtp-transport';
import { Uniqname } from '../helpers/generate.mjs';
import { hashCrypt, compareCrypt } from '../helpers/crypt.mjs';
dotenv.config();

export default class ClinicsController{

    async get(req, res) {
        try {
            const response = await Clincs.find();
            return res.status(200).json({
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
            const uniqname = Uniqname(clinic, strv);
            const hash = hashCrypt(password);
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

            const token = jwt.sign({ payload : response.uniqname }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '9999 years' });
            res.status(200).json({
                method : req.method,
                status : true,
                code : 200,
                acc_token: process.env.ACCESS_TOKEN_KEY,
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

            return Clincs.findByIdAndUpdate({ uniqname : uniqname }, {no_hp : phone, alamat: address})
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

    login(req, res) {
        try {
            const uniqname = req.body.uniqname;
            const password = req.body.password;

            return Clincs.find({
                uniqname : uniqname
            }).then(result => {
                const dbPassword = result[0].password;
                const match = compareCrypt(password, dbPassword);
                const token = jwt.sign({ payload : result[0].uniqname }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '9999 years' });
                if(match) {
                    res.status(200).json({
                        method : req.method,
                        status : true,
                        code : 200,
                        message : 'login success',
                        acc_token: process.env.ACCESS_TOKEN_KEY,
                        token : `Grevi ${token}`,
                        result : result
                    })
                } else {
                    res.status(404).json({
                        method : req.method,
                        status : false,
                        code : 404,
                        message : 'login failed, password not match',
                        token : null,
                        result : null
                    });
                }

            })
            .catch(err => {
                res.json({
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

    resetPassword(req, res) {
        try {
            const uniqname = req.params.uniqname;
            const email = req.body.email;
            const newPassword = req.body.new_password;
            const hash = hashCrypt(newPassword);

            let transporter = nodemailer.createTransport(smtpTransporter({
                host: process.env.NODEMAILER_HOST,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                port: 587,
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
            };

            return Clincs.updateOne({ uniqname : uniqname }, { password : hash })
            .then(result => {
                //console.log(result);

                if (result.nModified == 1) {
                    console.log(hash);
                    transporter.sendMail(mailOptions, (err, response) => {
                        if(err) console.log(err);
                        console.log(`response : ${response}`);
                    });

                    res.status(200).json({
                        method : req.method,
                        status : true,
                        code : 200,
                        modified : result.nModified,
                        message : 'Password berhasil diubah !, Silahkan cek email'
                    });
                } else {

                    res.status(404).json({
                        method : req.method,
                        status : false,
                        code : 404,
                        modified : result.nModified,
                        message : 'Username tidak ditemukan !'
                    });
                }
            })
            .catch((err) => {
                res.json({
                    method : req.method,
                    status : false,
                    code : 202,
                    err : `Promise err : ${err}`
                });
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
                res.status(200).json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                }); 
            }).catch((err) => {
                res.json({
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

    sendDummyMail(req, res) {
        let transporter = nodemailer.createTransport(smtpTransporter({
            host: process.env.NODEMAILER_HOST,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            port: 587,
            auth: {
                user: process.env.NODEMAILER_SMTP,
                pass: process.env.NODEMAILER_KEY
            }
        }));

        let mailOptions = {
            from: process.env.NODEMAILER_SMTP,
            to: 'resky67@gmail.com',
            subject: 'Reset Password Akun Aywa Admin',
            text: `Hallo...`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if(err) console.log(err);
            console.log(`response : ${response}`);
        });

        res.end();
    }
     
}
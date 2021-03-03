import dotenv from 'dotenv';
import Users from '../model/users.mjs';
import { Uniqname, generateAccToken } from '../helpers/generate.mjs';
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
            const username = Uniqname(name, phone);
            const address = req.body.alamat;
            const email = req.body.email;
            const uid = req.body.uid;
            console.log(username);

            const createObj = {
                name : name,
                username : username,
                no_hp : phone,
                alamat : address,
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

    updateUser(req, res) {
        try {
            const username = req.params.username;
            const phone = req.body.no_hp;
            const address = req.body.alamat;

            return Users.updateOne({ username: username }, { no_hp: phone, alamat: address })
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
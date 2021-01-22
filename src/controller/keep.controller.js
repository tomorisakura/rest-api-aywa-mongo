const Keep = require('../model/keep');
const fbService = require('../helpers/firebase.service');

class KeepController {

    getKeep = async (req, res) => {
        try {
            const response = await Keep.find()
            .populate({
                path: 'users_id',
                select: 'name no_hp alamat email'
            });

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

    findKeepUser = (req, res) => {
        try {
            const id = req.params.id;
            Keep.find({
                users_id : id
            })
            .populate({
                path : 'users_id',
                select: 'name no_hp alamat email'
            })
            .populate('pet_id')
            .then(result => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    result : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    insertKeep = async (req, res) => {
        try {
            const petId = req.body.pet_id;
            const usersId = req.body.users_id;
            
            const pet = {
                _id : petId
            };

            const users = {
                _id : usersId
            };

            const response = await new Keep({
                pet_id : pet,
                users_id : users,
                status_keep : 'keeped',
                state : false
            });

            response.save();

            let message = {
                notification : {
                    title : 'Ada yang ngekeep hewan peliharaan nih',
                    body : 'Seseorang telah ngekeep hewan'
                },
                topic : 'general'
            }

            fbService.messaging()
            .send(message)
            .then( result => {
                console.log(`Successfully send a message ${result}`);
            })
            .catch(err => {
                console.log('Error message :'+err);
            })

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

    updateKeep = (req, res) => {
        try {
            const keepId = req.params.id;
            return Keep.updateOne({
                _id: keepId
            }, {
                status_keep: 'success',
                state: true
            })
            .then((result) => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            }).catch((err) => {
                throw err;
            });
        } catch (error) {
            throw error;
        }
    }

    deleteKeep = (req, res) => {
        try {
            const keepId = req.params.id;

            return Keep.deleteOne({
                _id: keepId
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
                    err : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = KeepController;
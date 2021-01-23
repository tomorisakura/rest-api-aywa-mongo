const Keep = require('../model/keep');
const Pets = require('../model/pets');
const fbService = require('../helpers/firebase.service');

class KeepController {

    getKeep = async (req, res) => {
        try {
            const response = await Keep.find({
                status_keep : 'keeped'
            })
            .populate({
                path: 'users_id',
                select: 'name no_hp alamat email'
            })
            .populate('pet_id');

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

    findUserKeepSuccess = async (req, res) => {
        try {
            const id = req.params.id_user;

            return Keep.find({
                users_id : id,
                status_keep : 'success'
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
            })
        } catch (error) {
            throw error;
        }
    }

    findKeepUser = (req, res) => {
        try {
            const id = req.params.id;
            Keep.find({
                users_id : id,
                status_keep : 'keeped',
                state : false
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

    findKeepDetail = (req, res) => {
        try {
            const id = req.params.id;
            Keep.findOne({
                _id : id
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

            await Pets.updateOne({
                _id: petId
            }, {
                status : false
            });

            const message = {
                notification : {
                    title : 'Ada yang ngekeep hewan peliharaan nih 🧐',
                    body : 'Ayo dicek di pemberitahuan'
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

    //accept keep
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

                const message = {
                    notification : {
                        title : 'Klinik telah menerima keep kamu',
                        body : 'Terima kasih telah mengadopsi hewan dari klinik kami ❤'
                    },
                    topic : 'success-keep'
                }
    
                fbService.messaging()
                .send(message)
                .then( result => {
                    console.log(`Successfully send a message ${result}`);
                })
                .catch(err => {
                    console.log('Error message :'+err);
                });

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
                    result : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    findSuccessKeep = async (req, res) => {
        try {
            const response = await Keep.find({
                state : true
            })
            .populate({
                path: 'users_id',
                select: 'name no_hp alamat email'
            })
            .populate('pet_id')

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

    //cancel keep triggerd btn cancel
    cancelKeep = async (req, res) => {
        try {
            const id = req.params.id;
            const petId = req.body.id;

            const updateStatePet = Pets.updateOne({
                _id: petId
            }, {
                status : true
            });

            const updateKeepStatus = Keep.updateOne({
                _id : id
            }, {
                status_keep : 'cancel'
            })

            return Promise.all([updateStatePet, updateKeepStatus])
            .then(result => {
                const message = {
                    notification : {
                        title : 'Klinik telah ngecancel keep kamu',
                        body : 'Spertinya kamu lupa mengingat sesuatu.. 😥'
                    },
                    topic : 'cancel-keep'
                }
    
                fbService.messaging()
                .send(message)
                .then( result => {
                    console.log(`Successfully send a message ${result}`);
                })
                .catch(err => {
                    console.log('Error message :'+err);
                });

                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result[1]
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

    findAllCancelKeep = async (req, res) => {
        try {
            return Keep.find({
                status_keep : 'cancel'
            })
            .populate({
                path: 'users_id',
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
                    status : true,
                    code : 200,
                    result : err
                });
            })
        } catch (error) {
            throw error;
        }
    }

    //delete keep
    deleteKeep = async (req, res) => {
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
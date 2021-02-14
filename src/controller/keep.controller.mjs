import Keep from '../model/keep.mjs';
import Pets from '../model/pets.mjs';
import admin from '../helpers/firebase.service.mjs';

export default class KeepController {

    async getKeep(req, res) {
        try {
            const response = await Keep.find({
                status_keep : 'keeped'
            })
            .populate({
                path: 'users_id',
                select: 'name no_hp alamat email'
            })
            .populate('pet_id');

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

    findUserKeepSuccess(req, res) {
        try {
            const id = req.params.id_user;

            return Keep.find({
                users_id : id,
                status_keep : 'success'
            })
            .populate('pet_id')
            .then(result => {
                res.status(200).json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.json({
                    method : req.method,
                    status : false,
                    code : 202,
                    err : err,
                    result : []
                });
            })
        } catch (error) {
            throw error;
        }
    }

    findKeepUser(req, res) {
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
                res.status(200).json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.json({
                    method : req.method,
                    status : false,
                    code : 202,
                    err : err,
                    result : []
                });
            });
        } catch (error) {
            throw error;
        }
    }

    findKeepDetail(req, res){
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
                res.status(200).json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.json({
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

    async insertKeep(req, res){
        try {
            const petId = req.body.pet_id;
            const usersId = req.body.users_id;

            const response = await new Keep({
                pet_id : { _id : petId },
                users_id : { _id: usersId },
                status_keep : 'keeped',
                state : false
            });

            response.save();

            await Pets.updateOne({ _id: petId }, { status : false });

            const message = {
                notification : {
                    title : 'Ada yang ngekeep hewan peliharaan nih 🧐',
                    body : 'Ayo dicek di pemberitahuan'
                },
                topic : 'general'
            }

            admin.messaging()
            .send(message)
            .then( result => {
                console.log(`Successfully send a message ${result}`);
            })
            .catch(err => {
                console.log('Error message :'+err);
            });

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

    //accept keep
    updateKeep(req, res) {
        try {
            const keepId = req.params.id;

            return Keep.updateOne({ _id: keepId }, { status_keep: 'success', state: true})
            .then((result) => {

                const message = {
                    notification : {
                        title : 'Klinik telah menerima keep kamu',
                        body : 'Terima kasih telah mengadopsi hewan dari klinik kami ❤'
                    },
                    topic : 'success-keep'
                }
    
                admin.messaging()
                .send(message)
                .then( result => {
                    console.log(`Successfully send a message ${result}`);
                })
                .catch(err => {
                    console.log('Error message :'+err);
                });

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
                    result : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

    findSuccessKeep(req, res) {
        try {
            return Keep.find({
                state : true
            })
            .populate({
                path: 'users_id',
                select: 'name no_hp alamat email'
            })
            .populate('pet_id')
            .then(result => {
                res.status(200).json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.json({
                    method : req.method,
                    status : false,
                    code : 202,
                    message: `Promise err : ${err}`,
                    result : null
                });
            });
        } catch (error) {
            throw error;
        }
    }

    //cancel keep triggerd btn cancel
    cancelKeep(req, res) {
        try {
            const id = req.params.id;
            const petId = req.body.id;

            const updateStatePet = Pets.updateOne({ _id: petId}, { status : true });
            const updateKeepStatus = Keep.updateOne({ _id : id }, { status_keep : 'cancel' });

            return Promise.all([updateStatePet, updateKeepStatus])
            .then(result => {
                const message = {
                    notification : {
                        title : 'Klinik telah ngecancel keep kamu',
                        body : 'Spertinya kamu lupa mengingat sesuatu.. 😥'
                    },
                    topic : 'cancel-keep'
                };
    
                admin.messaging()
                .send(message)
                .then( result => {
                    console.log(`Successfully send a message ${result}`);
                })
                .catch(err => {
                    console.log('Error message :'+err);
                });

                res.json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result[1]
                });
            })
            .catch(err => {
                res.json({
                    method : req.method,
                    status : false,
                    code : 202,
                    message: `Promise err : ${err}`,
                    result : {}
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllCancelKeep(req, res) {
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
                res.json({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            })
            .catch(err => {
                res.json({
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
    async deleteKeep(req, res) {
        try {
            const keepId = req.params.id;

            return Keep.deleteOne({
                _id: keepId
            })
            .then((result) => {
                res.json({
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
                    err : err
                });
            });
        } catch (error) {
            throw error;
        }
    }

}
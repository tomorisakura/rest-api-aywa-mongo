const Keep = require('../model/keep');

class KeepController {

    getKeep = async (req, res) => {
        try {
            
            const response = await Keep.find()
            .populate('users_id')
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

            const response = new Keep({
                pet_id : pet,
                users_id : users,
                status_keep : 'keeped',
                state : false
            });

            response.save();

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
                throw err;
            });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = KeepController;
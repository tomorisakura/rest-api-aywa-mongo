import Types from '../model/types.mjs';

export default class TypesController {
    
    async get(req, res) {
        try {
            const response = await Types.find();
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

    insertTypes(req, res) {
        try {
            const types = req.body.type;

            return Types.findOne({
                jenis : types
            })
            .then((result) => {
                if(result) {
                    res.send({
                        method : req.method,
                        status : false,
                        code : 202,
                        message : 'Types already exists'
                    });
                } else {
                    const response = new Types({
                        jenis : types
                    });

                    response.save();

                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        result : response
                    });
                }
            }).catch((err) => {
                console.log(`promise err : ${err}`);
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

    updateTypes(req, res) {
        try {
            const id = req.params.id;
            const types = req.body.type;

            return Types.updateOne({
                _id: id
            }, {
                jenis : types,
                updatedAt : Date.now()
            })
            .then((result) => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            }).catch((err) => {
                console.log(`Promise err : ${err}`);
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

    deleteType(req, res) {
        try {
            const id = req.params.id;
            return Types.deleteOne({
                _id : id
            })
            .then((result) => {
                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : result
                });
            }).catch((err) => {
                console.log(err);
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
}
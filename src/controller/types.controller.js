const Types = require('../model/types');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mv = require('mv');

class TypesController {
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

    createPictures(req, res) {
        try {
            const form = formidable({ multiples : true });
            form.parse(req, (err, field, file) => {
                if(err) console.log(`formidable err : ${err}`);
                const type = field.type;

                const oldpath = file.image.path;
                const filename = file.image.name;

                const newpath = path.join(__dirname + `/../public/types/${filename}`);
                console.log(newpath);
                Types.findOne({
                    jenis : type
                })
                .then(result => {
                    if (result) {
                        res.send({
                            method : req.method,
                            status : false,
                            code : 202,
                            message : 'data already exist',
                            results : null
                        });
                    } else {
                        mv(oldpath, newpath, (err) => {
                            if(err) console.log(`mv err : ${err}`);
                        });

                        const response = new Types({
                            jenis : type,
                            pic_url : newpath,
                            pic_name : filename
                        })

                        response.save();

                        res.send({
                            method : req.method,
                            status : true,
                            code : 200,
                            results : response
                        });

                    }
                });

            });
            
        } catch (error) {
            throw error;
        }
    }

    updateTypes(req, res) {
        try {
            const name = req.query.name;

            const form = formidable({ multiples : true });
            form.parse(req, (err, field, file) => {
                
                return Types.findOne({
                    jenis : name
                })
                .then(result => {
                    if(result) {
                        const oldpath = result.pic_url;

                        fs.unlinkSync(oldpath, (err) => {
                            if(err) console.log(`unlink failed : ${err}`);
                            console.log('oldpath deleted');
                        });

                        Types.updateOne({
                            jenis : name
                        }, { $set : field },
                        (err) => {
                            if(err) {
                                res.send({
                                    method : req.method,
                                    status : false,
                                    code : 203,
                                    message : 'failed update data'
                                });
                            } else {
                                res.send({
                                    method : req.method,
                                    status : true,
                                    code : 200,
                                    message : 'success update data'
                                })
                            }
                        });
                    } else {
                        res.send({
                            method : req.method,
                            status : false,
                            code : 203,
                            message : 'cannot find type'
                        })
                    }
                }).catch((err) => {
                    console.log(`promise err : ${err}`);
                });

            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TypesController;
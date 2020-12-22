const Pets = require('../model/pets');
const Generate = require('../helpers/generate');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mv = require('mv');
const sharp = require('sharp');

const generate = new Generate();

class PetsController {

    async get(req, res) {
        try {
            const response = await Pets.find();
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            })
        } catch (error) {
            throw error;
        }
    }

    async getByType(req, res) {
        try {
            const typeId = req.query.id;
            const response = await Pets.find({ types : {
                _id : typeId
            }  }).populate('types').populate('clinic');
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            })
        } catch (error) {
            throw error;
        }
    }

    async getPetByClinic(req, res) {
        try {
            const clinicId = req.query.id;
            const response = await Pets.find({ clinic : {
                _id : clinicId
            }
            }).populate('types').populate('clinic').lean();
            return res.send({
                method : req.method,
                status : true,
                code : 200,
                result : response
            })
        } catch (error) {
            throw error;
        }
    }

    createPets(req, res) {
        try {
            
            const form = formidable({ multiples : true });
            form.parse(req, (err, field, file) => {
                if(err) console.log(`formidable err : ${err}`);
                const oldpath = file.image.path;
                const filename = file.image.name;

                const oldpathTwo = file.image_two.path;
                const filenameTwo = file.image_two.name;

                const clinicId = field.clinic;
                const typeId = field.type;
                const petname = field.petname;
                const owner = field.owner;
                const gender = field.gender;
                const weight = field.weight;
                const ras = field.ras;
                const age = field.age;
                const vaccine = field.vaccine;
                
                const uniqname = generate.Uniqpet(petname);

                const newPath = path.join(__dirname + `/../public/images/${filename}`);
                const newPathTwo = path.join(__dirname + `/../public/images/${filenameTwo}`);

                const compressedPath = path.join(__dirname +`/../public/compressed/${filename}`);
                const compressedPathTwo = path.join(__dirname +`/../public/compressed/${filenameTwo}`);

                //console.log(file.image);
                
                Pets.findOne({
                    uniqname : uniqname
                })
                .then(result => {

                    const clinic = {
                        _id : clinicId
                    };

                    const type = {
                        _id : typeId
                    };
    
                    const image = [{
                        pic_name : filename,
                        pic_url : `images/${filename}`
                    },{
                        pic_name : filenameTwo,
                        pic_url : `images/${filenameTwo}`
                    }];

                    if(!result) {

                        mv(oldpath, newPath, (err) => {
                            if(err) console.log(`mv err : ${err}`);
                        });

                        mv(oldpathTwo, newPathTwo, (err) => {
                            if(err) console.log(`mv two err : ${err}`);
                        });

                        setTimeout(() => {
                            sharp(newPath).jpeg({
                                quality: 50
                            }).toFile(compressedPath, (err, info) => {
                                if(err) console.log(`err : ${err}`);
                                console.log(`image one : ${info}`);
                            });
    
                            sharp(newPathTwo).jpeg({
                                quality: 50
                            }).toFile(compressedPathTwo, (err, info) => {
                                if(err) console.log(`err : ${err}`);
                                console.log(`image two : ${info}`);
                            });
                        }, 2000);

                        const response = new Pets({
                            clinic : clinic,
                            types : type,
                            picture : image,
                            nama_peliharaan : petname,
                            uniqname : uniqname,
                            pemilik_lama : owner,
                            jenis_kelamin : gender,
                            berat_peliharaan : weight,
                            ras_peliharaan : ras,
                            umur_peliharaan : age,
                            status_vaksin : vaccine,
                            status : true
                        });
    
                        response.save();
    
                        res.send({
                            method : req.method,
                            status : true,
                            code : 200,
                            results : response
                        });
    
                    } else {
                        res.send({
                            method : req.method,
                            status : false,
                            code : 202,
                            message : 'failed to insert data , please try again',
                            results : null
                        });
                    }
                });

            });
        } catch (error) {
            throw error;
        }
    }

    async updatePets(req, res) {
        try {
            const id = req.params.id;

            return Pets.findOne({ _id : id })
            .then((result) => {
                //console.log(result.picture[0].pic_url);
                const imageOne = result.picture[0].pic_url;
                const imageTwo = result.picture[1].pic_url;

                const form = formidable({ multiples: true });
                form.parse(req, (err, field, file) => {

                    const updatePath = file.image.path;
                    const filename = file.image.name;
    
                    const updatePathTwo = file.image_two.path;
                    const filenameTwo = file.image_two.name;
                    
                    const typeId = field.type;
                    const petname = field.petname;
                    const owner = field.owner;
                    const gender = field.gender;
                    const weight = field.weight;
                    const ras = field.ras;
                    const age = field.age;
                    const vaccine = field.vaccine;

                    const type = {
                        _id : typeId
                    };
    
                    const image = [{
                        pic_name : filename,
                        pic_url : `images/${filename}`
                    },{
                        pic_name : filenameTwo,
                        pic_url : `images/${filenameTwo}`
                    }];

                    Pets.updateOne({
                        _id : id
                    }, {
                        types: type,
                        nama_peliharaan: petname,
                        pemilik_lama: owner,
                        jenis_kelamin: gender,
                        berat_peliharaan: weight,
                        ras_peliharaan: ras,
                        umur_peliharaan: age,
                        status_vaksin: vaccine
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
                            message : `failed update pets`,
                            results : null
                        });
                        res.end();
                    });

                });

            }).catch((err) => {
                console.log(`Promise err : ${err}`);
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : `cant find pet with _id ${id}`,
                    results : null
                });
                res.end();
            });
        } catch (error) {
            throw error;
        }
    }

    deletePets = (req, res) => {
        try {
            
            const id = req.params.id

            const findPet = Pets.findOne({
                _id: id
            });

            const deletePet = Pets.deleteOne({
                _id: id
            });

            return Promise.all([findPet, deletePet])
            .then((result) => {
                const imageOne = result[0].picture[0].pic_url;
                //console.log(imageOne);
                const imageTwo = result[0].picture[1].pic_url;

                const pathOne = path.join(__dirname + `/../public/${imageOne}`);
                const pathTwo = path.join(__dirname + `/../public/${imageTwo}`);

                //console.log(pathOne);

                fs.unlinkSync(pathOne, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path one');
                });

                fs.unlinkSync(pathTwo, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path two');
                });

                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    result : `success delete pet ${result[0].uniqname}`
                });

            }).catch((err) => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : `promise failure : ${err}`,
                    results : null
                });
                
                throw err;
            });

        } catch (error) {
            throw error;
        }
    }

}

module.exports = PetsController;
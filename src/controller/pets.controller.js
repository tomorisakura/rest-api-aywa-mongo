'use strict';
const Pets = require('../model/pets');
const Generate = require('../helpers/generate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mv = require('mv');
const sharp = require('sharp');

const generate = new Generate();

const storage = multer.diskStorage({
    destination : __dirname+'/../public/images',
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' +Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    filetypes : /jpeg|jpg|png|gif/
}).array('imagePet', 12);

function checkFile(file, cb) {
    try {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
    
        if(mimetype && extname){
        return cb(null,true);
        } else {
        cb('Error: Images Only!');
        }
    } catch (error) {
        throw error;
    }
}

class PetsController {

    async get(req, res) {
        try {
            const response = await Pets.find({
                status : true
            })
            .populate('types')
            .populate('clinic');
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
            const response = await Pets.find({
                types : {_id : typeId},
                status : true  
            }).populate('types').populate('clinic');
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
            const clinicId = req.params.id;
            const response = await Pets.find({ 
                clinic : {_id : clinicId},
                status : true
            }).populate('types').lean();
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
            upload(req, res, (err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    const file = req.files;
                    const clinicId = req.body.clinic;
                    const typeId = req.body.type;
                    const petName = req.body.petname;
                    const oldOwner = req.body.owner;
                    const gender = req.body.gender;
                    const weight = req.body.weight;
                    const ras = req.body.ras;
                    const age = req.body.age;
                    const vaccine = req.body.vaccine;

                    const uniqname = generate.Uniqpet(petName);

                    const imageOne = file[0].filename; 
                    const imageTwo = file[1].filename;

                    console.log(`${imageOne}, ${imageTwo}`);

                    Pets.findOne({
                        uniqname : uniqname
                    })
                    .then((result) => {

                        if (result) {
                            console.log('exists, try again');
                            return;
                        } else {
                            console.log('existing pet..');
                            const pathImageOne = path.join(__dirname + `/../public/images/${imageOne}`);
                            const pathImageTwo = path.join(__dirname + `/../public/images/${imageTwo}`);

                            const compImageOne = path.join(__dirname +`/../public/compressed/${imageOne}`);
                            const compImageTwo = path.join(__dirname +`/../public/compressed/${imageTwo}`);

                            const clinic = {
                                _id: clinicId
                            };
    
                            const type = {
                                _id: typeId
                            };
    
                            const image = [{
                                pic_name : imageOne,
                                pic_url : `images/${imageOne}`,
                                pic_compress : `compressed/${imageOne}`
                            },{
                                pic_name : imageTwo,
                                pic_url : `images/${imageTwo}`,
                                pic_compress : `compressed/${imageTwo}`
                            }];

                            setTimeout(() => {
                                sharp(pathImageOne).jpeg({
                                    quality: 50
                                }).toFile(compImageOne, (err, info) => {
                                    if(err) console.log(`err : ${err}`);
                                    console.log(`image one : ${info}`);
                                });
        
                                sharp(pathImageTwo).jpeg({
                                    quality: 50
                                }).toFile(compImageTwo, (err, info) => {
                                    if(err) console.log(`err : ${err}`);
                                    console.log(`image two : ${info}`);
                                });

                            }, 2000);

                            try {
                                const response = new Pets({
                                    clinic : clinic,
                                    types : type,
                                    picture : image,
                                    nama_peliharaan : petName,
                                    uniqname : uniqname,
                                    pemilik_lama : oldOwner,
                                    jenis_kelamin : gender,
                                    berat_peliharaan : weight,
                                    ras_peliharaan : ras,
                                    umur_peliharaan : age,
                                    status_vaksin : vaccine,
                                    status : true                                
                                });
    
                                response.save();

                                console.log(clinic);
                                console.log(type);
                                console.log("saved");
    
                                res.status(200).send({
                                    method : req.method,
                                    status : true,
                                    code : 200,
                                    result : response
                                });
                            } catch (error) {
                                console.log(`failed saving data : ${error}`);
                            }

                        }
                    }).catch((err) => {
                        console.log(err);
                        res.send({
                            method : req.method,
                            status : false,
                            code : 202,
                            result : err
                        });
                    });
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async updatePets(req, res) {
        try {
            const id = req.params.id;

            const petName = req.body.petname;
            const oldOwner = req.body.owner;
            const gender = req.body.gender;
            const weight = req.body.weight;
            const ras = req.body.ras;
            const age = req.body.age;
            const typeId = req.body.type;
            const vaccine = req.body.vaccine;

            const uniqname = generate.Uniqpet(petName);

            return Pets.findOne({ _id : id })
            .then((result) => {
                //console.log(result.picture[0].pic_url);
                console.log(petName);

                const type = {
                    _id : typeId
                };

                Pets.updateOne({
                    _id : id
                }, {
                    types: type,
                    nama_peliharaan: petName,
                    pemilik_lama: oldOwner,
                    jenis_kelamin: gender,
                    berat_peliharaan: weight,
                    ras_peliharaan: ras,
                    umur_peliharaan: age,
                    status_vaksin: vaccine
                }).then(result => {
                    res.send({
                        method : req.method,
                        status : true,
                        code : 200,
                        result : result
                    });
                })

            }).catch((err) => {
                console.log(`Promise err : ${err}`);
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : `cant find pet with _id ${id}`,
                    result : null
                });
            });
        } catch (error) {
            throw error;
        }
    }

    findPets = async (req, res) => {
        try {
            const id = req.params.id;

            const response = await Pets.findOne({
                _id : id
            }).populate('types').populate('clinic').lean();

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
                const imageTwo = result[0].picture[1].pic_url;
                //console.log(imageOne);
                const imageCompressOne = result[0].picture[0].pic_compress;
                const imageCompressTwo = result[0].picture[1].pic_compress;

                const pathOne = path.join(__dirname + `/../public/${imageOne}`);
                const pathTwo = path.join(__dirname + `/../public/${imageTwo}`);
                //console.log(pathOne);
                const pathCompOne = path.join(__dirname + `/../public/${imageCompressOne}`);
                const pathCompTwo = path.join(__dirname + `/../public/${imageCompressTwo}`);

                fs.unlinkSync(pathOne, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path one');
                });

                fs.unlinkSync(pathTwo, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path two');
                });

                fs.unlinkSync(pathCompOne, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path comp one');
                });

                fs.unlinkSync(pathCompTwo, (err) => {
                    if(err) console.log(`Failed delete photos ${err}`);
                    console.log('deleted path comp two');
                });

                res.send({
                    method : req.method,
                    status : true,
                    code : 200,
                    message : `success delete pet ${result[0].uniqname}`
                });

            }).catch((err) => {
                res.send({
                    method : req.method,
                    status : false,
                    code : 202,
                    message : `promise failure : ${err}`
                });
                
                throw err;
            });

        } catch (error) {
            throw error;
        }
    }

}

module.exports = PetsController;
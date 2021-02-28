const Pets = require('../model/pets');
const Generate = require('../helpers/generate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const fbService = require('../helpers/firebase.service');

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

class PetsController extends Generate {

    constructor() {
        super();
    }

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

    createPets = (req, res) => {
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
                    const info = req.body.informasi

                    const uniqname = this.generatePetName(petName);
                    console.log(uniqname);

                    const imageOne = file[0].filename; 
                    const imageTwo = file[1].filename;

                    console.log(`${imageOne}, ${imageTwo}`);

                    const pathImageOne = path.join(__dirname + `/../public/images/${imageOne}`);
                    const pathImageTwo = path.join(__dirname + `/../public/images/${imageTwo}`);
                    //comp file
                    const compImageOne = path.join(__dirname +`/../public/compressed/${imageOne}`);
                    const compImageTwo = path.join(__dirname +`/../public/compressed/${imageTwo}`);

                    const createObj = {
                        clinic : { _id : clinicId },
                        types : { _id: typeId },
                        picture : [{
                            pic_name : imageOne,
                            pic_url : `images/${imageOne}`,
                            pic_compress : `compressed/${imageOne}`,
                            pic_storage : `https://firebasestorage.googleapis.com/v0/b/aywa-pet.appspot.com/o/${imageOne}?alt=media&token=grevi-123`
                        },{
                            pic_name : imageTwo,
                            pic_url : `images/${imageTwo}`,
                            pic_compress : `compressed/${imageTwo}`,
                            pic_storage : `https://firebasestorage.googleapis.com/v0/b/aywa-pet.appspot.com/o/${imageTwo}?alt=media&token=grevi-123`
                        }],
                        nama_peliharaan : petName,
                        uniqname : uniqname,
                        pemilik_lama : oldOwner,
                        jenis_kelamin : gender,
                        berat_peliharaan : weight,
                        ras_peliharaan : ras,
                        umur_peliharaan : age,
                        status_vaksin : vaccine,
                        informasi : info,
                        status : true  
                    };

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
                        const fbStorage = fbService.storage().bucket();
                        const response = new Pets(createObj);
                        response.save();

                        file.map(result => {
                            const metadata = {
                                metadata: {
                                    firebaseStorageDownloadTokens: 'aywa-grevi',
                                },
                                contentType: 'image/png',
                                cacheControl: 'public, max-age=31536000'
                            }
                
                            fbStorage.upload(result.path, {
                                gzip: true,
                                metadata: metadata
                            });
                            console.log(`Saved ${result.filename}`);
                        });
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
            });
        } catch (error) {
            throw error;
        }
    }

    updatePets = (req, res) => {
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
            const info = req.body.informasi;
            const uniqname = this.generatePetName(petName);

            const updateObj = {
                types: { 
                    _id : typeId
                },
                nama_peliharaan: petName,
                pemilik_lama: oldOwner,
                jenis_kelamin: gender,
                berat_peliharaan: weight,
                ras_peliharaan: ras,
                umur_peliharaan: age,
                informasi: info,
                status_vaksin: vaccine
            };

            return Pets.findByIdAndUpdate({ _id: id}, updateObj, {new : true})
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
                    message : `promise failure : ${err}`
                });
                throw err;
            });

        } catch (error) {
            throw error;
        }
    }

    findPets(req, res) {
        try {
            const id = req.params.id;

            return Pets.findOne({
                _id : id
            })
            .populate('types')
            .populate('clinic')
            .lean()
            .then(result => {
                res.send({
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

                result[0].picture.map(data => {
                    const originalPath = path.join(__dirname + `/../public/${data.pic_url}`);
                    const compressedPath = path.join(__dirname + `/../public/${data.pic_compress}`);

                    fs.unlink(originalPath, (err) => {
                        if(err) console.log(`Failed delete photos ${err}`);
                        console.log(`deleted original path of ${data.pic_url}`);
                    });
                    fs.unlink(compressedPath, (err) => {
                        if(err) console.log(`Failed delete photos ${err}`);
                        console.log(`deleted compressed path of ${data.pic_compress}`);
                    });
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
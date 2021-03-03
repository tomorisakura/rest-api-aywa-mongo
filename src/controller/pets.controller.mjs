import Pets from '../model/pets.mjs';
import { Uniqpet } from '../helpers/generate.mjs';
import admin from '../helpers/firebase.service.mjs';
import { upload, __dirname } from '../helpers/multer.mjs';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export default class PetsController {

    get(req, res) {
        try {
            return Pets.find({
                status : true
            })
            .populate('types')
            .populate('clinic')
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
                    message : `Promise err : ${err}`,
                    result : null
                });
            });
        } catch (error) {
            throw error;
        }
    }

    getByType(req, res) {
        try {
            const typeId = req.query.id;
            return Pets.find({
                types : { _id : typeId },
                status : true
            })
            .populate('types')
            .populate('clinic')
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

    getPetByClinic(req, res) {
        try {
            const clinicId = req.params.id;
            return Pets.find({ 
                clinic : {_id : clinicId},
                status : true
            }).populate('types')
            .lean()
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

    async createPets(req, res) {
        try {
            upload(req, res, (err) => {
                if (err) {
                    console.log(err);
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

                    const uniqname = Uniqpet(petName);

                    const imageOne = file[0].filename; 
                    const imageTwo = file[1].filename;

                    console.log(`${imageOne}, ${imageTwo}`);
                    const pathImageOne = path.join(__dirname + `/../public/images/${imageOne}`);
                    const pathImageTwo = path.join(__dirname + `/../public/images/${imageTwo}`);
                    //comp image
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
                        const fbStorage = admin.storage().bucket();

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

    updatePets(req, res) {
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
            })

        } catch (error) {
            throw error;
        }
    } 

    findPetByRas(req, res) {
        try {
            const ras = req.query.ras;

            return Pets.find({ ras_peliharaan: { $regex: ras, $options: 'i' } })
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
            })

        } catch (error) {
            throw error;
        }
    }

    deletePets(req, res) {
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
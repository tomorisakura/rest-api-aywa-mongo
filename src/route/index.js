'use strict';
const route = require('express').Router();
const usersController = require('../controller/users.controller');
const clinicsController = require('../controller/clinics.controller');
const petsController = require('../controller/pets.controller');
const typesController = require('../controller/types.controller');
const provinceController = require('../controller/province.controller');
const keepController = require('../controller/keep.controller');
const auth = require('../middleware/auth');

route.get('/', (req, res) => {
    res.send({
        method: req.method,
        message: "Wellcome to Aywa Pet Service 🦊"
    });
    res.end();
});

route.get('/api', (req, res) => {
    res.send({
        method: req.method,
        message: "unch, this service is private dude h3h3 🦊"
    });
    res.end();
});

//SAFE ROUTE
route.get('/api/users/auth/verify', new usersController().findEmail);
route.post('/api/users/post', new usersController().createUsers);
route.get('/api/users/login', new usersController().login);

route.post('/api/clinics/login', new clinicsController().login);
route.post('/api/clinics/post', new clinicsController().createClinics);
route.patch('/api/clinics/reset-pw/:uniqname', new clinicsController().resetPassword);

route.post('/api/pet/dummy/post', new petsController().uploadDummy);

//AUTHORIZED ROUTE
route.get('/api/users/get', new auth().authorization, new usersController().get);
route.delete('/api/users/delete/:username', new auth().authorization, new usersController().deleteUser);

route.get('/api/clinics/get', new auth().authorization, new clinicsController().get);
route.patch('/api/clinics/update/:uniqname', new auth().authorization, new clinicsController().updateClinics);
route.get('/api/clinics/find-clinic/:uniqname', new auth().authorization, new clinicsController().getClinic);

route.post('/api/pet/post', new auth().authorization, new petsController().createPets);
route.get('/api/pet/get', new auth().authorization, new petsController().get);
route.get('/api/pet/get-type', new auth().authorization, new petsController().getByType);
route.patch('/api/pet/update/:id', new auth().authorization, new petsController().updatePets);
route.delete('/api/pet/delete/:id', new auth().authorization, new petsController().deletePets);
route.get('/api/pet/get-by-clinic/:id', new auth().authorization, new petsController().getPetByClinic);
route.get('/api/pet/get-pet/:id', new auth().authorization, new petsController().findPets);

route.get('/api/types/get', new auth().authorization, new typesController().get);
route.post('/api/types/post', new auth().authorization, new typesController().insertTypes);
route.patch('/api/types/update-type/:id', new auth().authorization, new typesController().updateTypes);
route.delete('/api/types/delete/:id', new auth().authorization, new typesController().deleteType)

route.get('/api/keep/get', new auth().authorization, new keepController().getKeep);
route.post('/api/keep/post', new auth().authorization, new keepController().insertKeep);
route.patch('/api/keep/update/:id', new auth().authorization, new keepController().updateKeep);
route.delete('/api/keep/delete/:id', new auth().authorization, new keepController().deleteKeep);
route.get('/api/keep/find/:id', new auth().authorization, new keepController().findKeepUser);
route.get('/api/keep/find-success', new auth().authorization, new keepController().findSuccessKeep);
route.get('/api/keep/find-detail/:id', new auth().authorization, new keepController().findKeepDetail);
route.get('/api/keep/find-cancel', new auth().authorization, new keepController().findAllCancelKeep);
route.patch('/api/keep/cancel/:id', new auth().authorization, new keepController().cancelKeep);
route.get('/api/keep/success/user/:id_user', new auth().authorization, new keepController().findUserKeepSuccess);

route.get('/api/province', new auth().authorization, new provinceController().getProvince);
route.get('/api/kabupaten/:id', new auth().authorization, new auth().authorization, new provinceController().getKabupaten);
route.get('/api/kecamatan/:id', new auth().authorization, new provinceController().getKecamatan);

module.exports = route;

const route = require('express').Router();
const usersController = require('../controller/users.controller');
const clinicsController = require('../controller/clinics.controller');
const petsController = require('../controller/pets.controller');
const typesController = require('../controller/types.controller');
const provinceController = require('../controller/province.controller');
const keepController = require('../controller/keep.controller');

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

route.get('/api/users/get', new usersController().get);
route.post('/api/users/post', new usersController().createUsers);
route.patch('/api/users/update/:username', new usersController().updateUsers);
route.delete('/api/users/delete/:username', new usersController().deleteUser);
route.get('/api/users/login', new usersController().login);
route.get('/api/users/auth/verify', new usersController().findEmail);

route.get('/api/clinics/get', new clinicsController().get);
route.post('/api/clinics/post', new clinicsController().createClinics);
route.patch('/api/clinics/update/:uniqname', new clinicsController().updateClinics);
route.post('/api/clinics/login', new clinicsController().login);

route.get('/api/clinics/reset-pw/:uniqname', new clinicsController().resetPassword);

route.get('/api/clinics/find-clinic/:uniqname', new clinicsController().getClinic);

route.post('/api/pet/post', new petsController().createPets);
route.get('/api/pet/get', new petsController().get);
route.get('/api/pet/get-type', new petsController().getByType);
route.patch('/api/pet/update/:id', new petsController().updatePets);
route.delete('/api/pet/delete/:id', new petsController().deletePets);
route.get('/api/pet/get-by-clinic/:id', new petsController().getPetByClinic);
route.get('/api/pet/get-pet/:id', new petsController().findPets);

route.get('/api/types/get', new typesController().get);
route.post('/api/types/post', new typesController().insertTypes);
route.patch('/api/types/update-type/:id', new typesController().updateTypes);
route.delete('/api/types/delete/:id', new typesController().deleteType)

route.get('/api/keep/get', new keepController().getKeep);
route.post('/api/keep/post', new keepController().insertKeep);
route.patch('/api/keep/update/:id', new keepController().updateKeep);
route.delete('/api/keep/delete/:id', new keepController().deleteKeep);
route.get('/api/keep/find/:id',new keepController().findKeepUser);
route.get('/api/keep/find-success', new keepController().findSuccessKeep);
route.get('/api/keep/find-detail/:id', new keepController().findKeepDetail);
route.get('/api/keep/find-cancel', new keepController().findAllCancelKeep);
route.patch('/api/keep/cancel/:id', new keepController().cancelKeep);
route.get('/api/keep/success/user/:id_user', new keepController().findUserKeepSuccess);

route.get('/api/province', new provinceController().getProvince);
route.get('/api/kabupaten/:id', new provinceController().getKabupaten);
route.get('/api/kecamatan/:id', new provinceController().getKecamatan);

module.exports = route;

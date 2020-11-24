const route = require('express').Router();
const usersController = require('../controller/users.controller');
const clinicsController = require('../controller/clinics.controller');
const petsController = require('../controller/pets.controller');
const typesController = require('../controller/types.controller');

route.get('/api/users/get', new usersController().get);
route.post('/api/users/post', new usersController().createUsers);
route.patch('/api/users/update/:username', new usersController().updateUsers);
route.delete('/api/users/delete/:username', new usersController().deleteUser);
route.get('/api/users/login', new usersController().login);

route.get('/api/clinics/get', new clinicsController().get);
route.post('/api/clinics/post', new clinicsController().createClinics);
route.patch('/api/clinics/:uniqname', new clinicsController().updateClinics);
route.get('/api/clinics/login', new clinicsController().login);

route.get('/api/clinics/reset-pw/:uniqname', new clinicsController().resetPassword);

route.post('/api/pet/post', new petsController().createPets);
route.get('/api/pet/get', new petsController().get);
route.get('/api/pet/get-type', new petsController().getByType);
route.patch('/api/pet/update/:id', new petsController().updatePets);

route.get('/api/types/get', new typesController().get);
route.post('/api/types/post', new typesController().createPictures);
route.patch('/api/types/update/', new typesController().updateTypes);

module.exports = route;
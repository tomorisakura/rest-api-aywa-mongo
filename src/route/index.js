const route = require('express').Router();
const usersController = require('../controller/users.controller');
const clinicsController = require('../controller/clinics.controller');
const petsController = require('../controller/pets.controller');

route.get('/api/users/get', new usersController().get);
route.post('/api/users/post', new usersController().createUsers);
route.patch('/api/users/:username', new usersController().updateUsers);
route.get('/api/users/login', new usersController().login);

route.get('/api/clinics/get', new clinicsController().get);
route.post('/api/clinics/post', new clinicsController().createClinics);
route.patch('/api/clinics/:uniqname', new clinicsController().updateClinics);

route.post('/api/pet/post', new petsController().createPets);

module.exports = route;
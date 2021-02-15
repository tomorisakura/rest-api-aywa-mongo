import express from 'express';
import UsersController from '../controller/users.controller.mjs';
import ClinicsController from '../controller/clinics.controller.mjs'
import PetsController from '../controller/pets.controller.mjs';
import TypesController from '../controller/types.controller.mjs'
import ProvinceController from '../controller/province.controller.mjs';
import KeepController from '../controller/keep.controller.mjs';
import Auth from '../middleware/auth.mjs';
const route = express.Router();

route.get('/', (req, res) => {
    res.send({
        method: req.method,
        message: "Wellcome to Aywa Pet Service 🦊",
        version: '1.0.1 - Alpha'
    });
});

route.get('/api', (req, res) => {
    res.send({
        method: req.method,
        message: "unch, this service is private dude h3h3 🦊"
    });
});

//route.post('/api/auth/token', new Auth().refreshToken);

//SAFE ROUTE
route.get('/api/users/auth/verify', new UsersController().findEmail);
route.post('/api/users/post', new UsersController().createUsers);
route.get('/api/users/login', new UsersController().login);

route.post('/api/clinics/login', new ClinicsController().login);
route.post('/api/clinics/post', new ClinicsController().createClinics);
route.patch('/api/clinics/reset-pw/:uniqname', new ClinicsController().resetPassword);


//AUTHORIZED ROUTE
route.get('/api/users/get', new Auth().authorization, new UsersController().getUsers);
route.delete('/api/users/delete/:username', new Auth().authorization, new UsersController().deleteUser);

route.get('/api/clinics/get', new Auth().authorization, new ClinicsController().get);
route.patch('/api/clinics/update/:uniqname', new Auth().authorization, new ClinicsController().updateClinics);
route.get('/api/clinics/find-clinic/:uniqname', new Auth().authorization, new ClinicsController().getClinic);

route.post('/api/pet/post', new Auth().authorization, new PetsController().createPets);
route.get('/api/pet/get', new Auth().authorization, new PetsController().get);
route.get('/api/pet/get-type', new Auth().authorization, new PetsController().getByType);
route.patch('/api/pet/update/:id', new Auth().authorization, new PetsController().updatePets);
route.delete('/api/pet/delete/:id', new Auth().authorization, new PetsController().deletePets);
route.get('/api/pet/get-by-clinic/:id', new Auth().authorization, new PetsController().getPetByClinic);
route.get('/api/pet/get-pet/:id', new Auth().authorization, new PetsController().findPets);

route.get('/api/types/get', new Auth().authorization, new TypesController().get);
route.post('/api/types/post', new Auth().authorization, new TypesController().insertTypes);
route.patch('/api/types/update-type/:id', new Auth().authorization, new TypesController().updateTypes);
route.delete('/api/types/delete/:id', new Auth().authorization, new TypesController().deleteType)

route.get('/api/keep/get', new Auth().authorization, new KeepController().getKeep);
route.post('/api/keep/post', new Auth().authorization, new KeepController().insertKeep);
route.patch('/api/keep/update/:id', new Auth().authorization, new KeepController().updateKeep);
route.delete('/api/keep/delete/:id', new Auth().authorization, new KeepController().deleteKeep);
route.get('/api/keep/find/:id', new Auth().authorization, new KeepController().findKeepUser);
route.get('/api/keep/find-success', new Auth().authorization, new KeepController().findSuccessKeep);
route.get('/api/keep/find-detail/:id', new Auth().authorization, new KeepController().findKeepDetail);
route.get('/api/keep/find-cancel', new Auth().authorization, new KeepController().findAllCancelKeep);
route.patch('/api/keep/cancel/:id', new Auth().authorization, new KeepController().cancelKeep);
route.get('/api/keep/success/user/:id_user', new Auth().authorization, new KeepController().findUserKeepSuccess);

route.get('/api/province', new Auth().authorization, new ProvinceController().getProvince);
route.get('/api/kabupaten/:id', new Auth().authorization, new ProvinceController().getKabupaten);
route.get('/api/kecamatan/:id', new Auth().authorization, new ProvinceController().getKecamatan);

export default route;

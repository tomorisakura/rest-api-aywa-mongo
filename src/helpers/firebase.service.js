const admin = require('firebase-admin');
const serviceAccount = require('../config/aywa-pet-firebase-adminsdk-eqs0y-442c81dd1d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
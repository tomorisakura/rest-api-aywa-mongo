const admin = require('firebase-admin');
const fbConfig = require('../config/firebase');
const serviceAccount = require('../config/aywa-pet-firebase-adminsdk-eqs0y-442c81dd1d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: fbConfig.storageBucket
});

module.exports = admin;
const admin = require('firebase-admin');
const { firebaseConfig, firebaseSdk } = require('../config/constant');

admin.initializeApp({
    credential: admin.credential.cert(firebaseSdk),
    storageBucket: firebaseConfig.storageBucket
});

module.exports = admin;
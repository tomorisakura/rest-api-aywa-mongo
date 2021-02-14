import admin from 'firebase-admin';
import {firebaseConfig , firebaseSdk} from '../config/constant.mjs';

admin.initializeApp({
    credential: admin.credential.cert(firebaseSdk),
    storageBucket: firebaseConfig.storageBucket
});

export default admin;
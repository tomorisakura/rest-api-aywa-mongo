'use strict';
const mongoose = require('mongoose');

class Configure {
    connection() {
        try {
            const connect = mongoose.connect('mongodb://localhost:27017/aywa_db', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            if(!connect) console.log(`db connection err`);
            console.log('mongo connected');
            return connect;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Configure;
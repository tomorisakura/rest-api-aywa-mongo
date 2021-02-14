import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class Configure {
    connection() {
        try {
            const connect = mongoose.connect(process.env.DB_HOST, {
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

export default Configure;
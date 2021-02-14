import multer from 'multer';
import path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination : __dirname+'/../public/images',
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' +Date.now() + path.extname(file.originalname));
    }
});

function checkFile(file, cb) {
    try {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
    
        if(mimetype && extname){
        return cb(null,true);
        } else {
        cb('Error: Images Only!');
        }
    } catch (error) {
        throw error;
    }
}

export const upload = multer({
    storage: storage,
    filetypes : /jpeg|jpg|png|gif/
}).array('imagePet', 12);
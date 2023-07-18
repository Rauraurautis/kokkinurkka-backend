import multer from "multer"

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_');
        
        const extension = MIME_TYPES[file.mimetype];
        cb(null, name + Date.now() + '.' + extension);
    }
});

export const multerConfig = multer({ storage: storage }).single('image');


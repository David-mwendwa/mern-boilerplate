import multer from 'multer';
import { NotFoundError } from '../errors/index.js';

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uplaodError = new NotFoundError('invalid image');
    if (isValid) {
      uplaodError = null;
    }
    cb(uplaodError, 'client/public/uploads'); // path to images - must create the folders first
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName.replace(/.\w+$/, '')}-${Date.now()}.${extension}`);
  },
});

// call uploadOptions as middleware in the route where you want to upload the images
// e.g uploadOptions.single('image') for single image
// e.g uploadOptions.array('images', 10) for multiple images - 10 for max
export const uploadOptions = multer({ storage: storage });

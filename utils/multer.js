import path from 'path';
import multer from 'multer';
import { NotFoundError } from '../errors/index.js';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'client/public/uploads'); //TODO: provide the correct path to uploads folder (NO PROCEEDING SLASH)
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new NotFoundError('You can only upload images!')); // or cb('Error: You can only upload images!');
  }
};

// call uploadOptions as middleware in the route where you want to upload the images
// e.g uploadOptions.single('image') for single image => 'image', param should be the image fieldName
// e.g uploadOptions.array('images', 10) for multiple images - 10 for max
export const uploadOptions = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

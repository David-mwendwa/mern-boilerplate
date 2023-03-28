import path from 'path';
import multer from 'multer';
import { NotFoundError } from '../errors/index.js';

/**
 * Provide the correct path to the uploads folder - no proceeding slash!
 * @param {*} uploadPath path to uploads location or client file storage
 */
const uploadPath = 'client/public/uploads';
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

/**
 * Check for allowed file content types
 * @param {*} file upload file
 * @param {*} cb parse an error string incase the file doesn't meet the required content type @example cb('You can only upload images!')
 * @returns
 */
const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new NotFoundError('You can only upload images!'));
  }
};

/**
 * Parse form data files through uploadOptions middleware to the request - accepts images only!
 * @call_method {*} .single(...) parse a single file, usually with the upload file field name @example uploadOptions.single('image')
 * @call_method {*} .array(...) parse a an array of multiple files, usually with the upload file field name as first param and files limit as second param @example uploadOptions.array('images', 10)
 */
export const uploadOptions = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

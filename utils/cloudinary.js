import cloudinary from 'cloudinary';
import { BadRequestError } from '../errors/index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// import as {upload} and parse req object as a param
exports.upload = async (req, res) => {
  try {
    let file =
      req.files?.avatar ||
      req.files?.image ||
      req.files?.images ||
      req.files?.img;
    if (file) {
      return await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: 'avatars', // cloudinary folder where the images are saved
        // width: 300, // width of an image
        // crop: 'scale',
        resource_type: 'auto',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

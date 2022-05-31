import cloudinary from 'cloudinary';
import { BadRequestError } from '../errors/index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// import as {upload} and parse req object and options:{folder, width, crop, public_id etc} as params
exports.upload = async (req, options) => {
  try {
    let file =
      req.body?.avatar ||
      req.body?.avatars ||
      req.body?.photo ||
      req.body?.photos ||
      req.body?.image ||
      req.body?.images ||
      req.body?.pic ||
      req.body?.pics ||
      req.body?.picture ||
      req.body?.pictures ||
      req.body?.profilePic ||
      req.body?.profilePics;
    if (file) {
      return await cloudinary.v2.uploader.upload(file, {
        resource_type: 'auto',
        ...options,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// parse image as a parameter
// TODO: confirm if the image param is parsed, is from cloudinary and has public id
exports.deleteCloudinaryImage = async (image) => {
  await cloudinary.v2.uploader.destroy(image.public_id);
};

import cloudinary from 'cloudinary';

/**
 * Add cloudinary configurations
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to cloudinary
 * @param {*} file file request body e.g req.body.image
 * @param {*} options image options as object i.e folder: path to cloudinary storage folder, width, crop, public_id etc
 * @returns cloudinary result object i.e contains public_id, secure_url, url etc
 */
// TODO: add a functionality to upload pdf, doc or other files
const uploadToCloudinary = async (file, options) => {
  try {
    let match = /data:([a-z\/]+)/.exec(file);
    if (file && match && /image/.test(match[1])) {
      return await cloudinary.v2.uploader.upload(file, {
        resource_type: 'auto',
        ...options,
      });
    } else throw `You can only upload images! (uploaded mimeType:${match[1]})`;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Destroy cloudinary file (can be used when updating or deleting a document)
 * @param {*} id id of the file to delete (usually public_id)
 */
const removeFromCloudinary = async (id) => {
  try {
    if (id) {
      return await cloudinary.v2.uploader.destroy(id);
    } else throw 'Please provide cloudinary id';
  } catch (error) {
    throw new Error(error);
  }
};

export { uploadToCloudinary, removeFromCloudinary };

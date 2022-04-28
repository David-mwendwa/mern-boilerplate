import { BadRequestError } from '../errors/index.js';
import Test from '../models/Test.js';

export const test = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Please provide an image');
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get(
    'host'
  )}/client/public/uploads/`;
  const imagePath = `${basePath}${fileName}`;

  let test = new Test({ ...req.body, image: imagePath });
  test = await test.save();
  res.status(201).json({ test });
};

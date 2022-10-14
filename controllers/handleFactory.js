import { StatusCodes } from 'http-status-codes';
import APIFeatures from '../utils/apiFeatures.js';
import { NotFoundError } from '../errors/index.js';

const createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: { data: doc },
  });
};

const getOne = (Model, populateOptions) => async (req, res, next) => {
  let query = Model.findById(req.params.id);

  if (populateOptions) {
    query = query.populate(populateOptions);
  }
  const doc = await query;

  if (!doc) {
    throw new NotFoundError('No document found with that ID');
  }
  res.status(StatusCodes.OK).json({ status: 'success', data: { data: doc } });
};

const getAll = (Model, searchField) => async (req, res, next) => {
  // Allow for nested GET reviews on tour
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // Allow for search functionality
  searchField = searchField || 'name'; // specify a search field
  const keyword = req.query.keyword
    ? { [searchField]: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  filter = { ...filter, keyword };

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: doc.length,
    data: { data: doc },
  });
};

const updateOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    throw new NotFoundError('No document found with that ID');
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: { data: doc },
  });
};

const deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndRemove(req.params.id);

  if (!doc) {
    throw new NotFoundError('No document found with that ID');
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

// parse model parameter on invoking
export { getAll, getOne, createOne, updateOne, deleteOne };

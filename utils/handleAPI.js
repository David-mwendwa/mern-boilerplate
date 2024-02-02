import { NotFoundError } from '../errors/customErrors.js';

/**
 * A class handler function for API features
 * @query mongoose query - mongoose data model and it's find method @example Model.find({...})
 * @queryStr express api query method @example req.query
 */
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // make a default search by name, keyword as the value i.e ?keyword='macbook'
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const excludedFilds = ['keyword', 'page', 'sort', 'limit', 'fields'];
    excludedFilds.forEach((el) => delete queryCopy[el]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate(pageSize) {
    const currentPage = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || pageSize || 100; // results per page
    const skip = (currentPage - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

/**
 * Create a document
 * @param {*} Model mongoose data model
 * @returns created document
 */
const createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(200).json({ success: true, data: doc });
};

/**
 * Get single document
 * @param {*} Model mongoose data model
 * @param {*} populateOptions options to parse to mongoose populate method
 * @example (singlepopulate) getOne(<Model>, { path: 'user', select: 'name email role'})
 * @example (multiplepupulates) getOne(<Model>, [{path: 'user', select: ''}, {path: 'product', select: ''}])
 * @returns one document
 */
const getOne = (Model, populateOptions) => async (req, res, next) => {
  const documentId = req.params.id || req.query.id;
  let query = Model.findById(documentId);
  if (populateOptions) {
    query = query.populate(populateOptions);
  }
  const doc = await query;
  if (!doc)
    throw new NotFoundError(`No document found with that ID: ${documentId}`);
  res.status(200).json({ success: true, data: doc });
};

/**
 * Query and get one or more documents
 * @param {*} Model mongoose data model
 * @returns one or more documents
 */
const getMany = (Model) => async (req, res, next) => {
  let filter = {};
  // handle nested routes - param kay has to be similar to the property in the database @example {productId: req.params.productId}
  const isNestedRoute = !!Object.keys(req.params).length;
  if (isNestedRoute === true) {
    for (const key in req.params) {
      filter[[key]] = req.params[key];
    }
  }

  let pageSize = 10;
  const features = new APIFeatures(Model.find(filter), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate(pageSize);

  const doc = await features.query;

  res.status(200).json({
    success: true,
    data: doc,
    meta: {
      pagination: {
        page: req.query.page || 1,
        pageSize: req.query.limit || pageSize || 100,
        pageCount: doc.length,
        total: await Model.countDocuments(),
      },
    },
  });
};

/**
 * Update document by id
 * @param {*} Model mongoose data model
 * @returns updated document
 */
const updateOne = (Model) => async (req, res, next) => {
  const documentId = req.params.id || req.query.id;
  const doc = await Model.findByIdAndUpdate(documentId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc)
    throw new NotFoundError(`No document found with that ID: ${documentId}`);
  res.status(201).json({ success: true, data: doc });
};

/**
 * Delete document by id
 * @param {*} Model mongoose data model
 * @returns null
 */
const deleteOne = (Model) => async (req, res, next) => {
  const documentId = req.params.id || req.query.id;
  const doc = await Model.findByIdAndDelete(documentId);
  if (!doc)
    throw new NotFoundError(`No document found with that ID: ${documentId}`);
  res.status(204).json({ success: true, data: null });
};

export { APIFeatures, getMany, getOne, createOne, updateOne, deleteOne };

/**
 * Add data to the mongoDB
 * @param {*} Model - Model of the data you want to add - import the model
 * @param {*} data - data in json form - import the data
 * @example seedProduct(Product, products)
 */
const seedProducts = async (Model, data) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Model.deleteMany();
    await Model.insertMany(data);
    console.log('data added successfully');
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
seedProducts();

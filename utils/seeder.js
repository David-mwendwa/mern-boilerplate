import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

// import a Model & the data to seed

/**
 * Add data to the mongoDB
 * @param {*} Model - Model of the data you want to add - import the model
 * @param {*} data - data in parsed form - import the data
 * @example seedProduct(Product, products)
 */
const seedData = async (Model, data) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Model.deleteMany();
    console.log('initial data deleted');
    await Model.insertMany(data);
    console.log('new data added successfully');
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
seedData();

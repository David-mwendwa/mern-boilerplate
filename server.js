import path from 'path';
import 'express-async-errors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import express from 'express';
import dotenv from 'dotenv';

// import extra security packages
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

// import middleware
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// import routes
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import productRouter from './routes/productRoutes.js';

const app = express();
dotenv.config();

// handle unhandled errors that occur in synchronous code i.e undefined value
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION! Shutting down...`);
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(helmet());

app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser()); // you can parse process.env.JWT_SECRET param - signs cookie
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// make static images available in the frontend - multer
//app.use(express.static(path.resolve(__dirname, '/client/public/uploads'))); // - when using commonjs
// _dirname is not available by default when using es-module-import (only available in commonjs) hence the need to create it
// const __dirname = path.resolve();
// app.use(
//   '/client/public/uploads',
//   express.static(path.join(__dirname, '/client/public/uploads'))
// );

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Homepage' });
  });
}

// use extra security package middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60 minutes
  message:
    'Too many requests from this IP address! Please try again after an hour',
});
app.use('/api', limiter);
app.use(xss()); // sanitize data against XSS
app.use(mongoSanitize()); // sanitize data against NoSQL query injection i.e email: {$gt: ""}
app.use(hpp({ whitelist: [''] })); // prevent parameter pollution i.e sort=duration&sort=price - accepts params

// use routes
app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', productRouter);

//render index page - used after running => npm run build-client
if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, './client/build'))); // read from server.js

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html')); // read from server.js
  });
}

// use error middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start server
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL_TEST;
mongoose
  .connect(DB)
  .then(() => console.log('mongoDB connection successful'))
  .catch((err) => console.log(`could not connect to mongoDB`, err));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// handle errors occurring outside express i.e incorrect db password, invalid connection string
process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION! Shutting down...`);
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

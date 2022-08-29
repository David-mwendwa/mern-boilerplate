import 'express-async-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// import extra security packages
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

// import mongoDB connection
import connectDB from './db/connect.js';

// import routes
import authRouter from './routes/authRoutes.js';
import testRouter from './routes/testRoute.js';

// import middlewares
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// handle unhandled errors that occur in synchronous code i.e undefined value
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION! Shutting down...`);
  server.close(() => process.exit(1));
});

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

// make static images available in the frontend
//app.use(express.static(path.resolve(__dirname, '/client/public/uploads')));
// app.use(
//   '/client/public/uploads',
//   express.static(__dirname + '/client/public/uploads')
// );

// use extra security packages
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(fileUpload({ useTempFiles: true }));

app.use(cookieParser()); // you can parse process.env.JWT_SECRET param - signs cookie

// use routes
app.use('/api/v1', authRouter);
app.use('/api/v1/test', testRouter);

//render index page - used after running => npm run build-client
if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, './client/build'))); // read from server.js

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html')); // read from server.js
  });
}

// use error middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();

// handle errors occuring outside express i.e incorrect db password, invalid connection string
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! Shutting down...`);
  server.close(() => process.exit(1));
});

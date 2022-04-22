import 'express-async-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
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

// import middlewares
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

// use extra security packages
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(cookieParser(process.env.JWT_SECRET)); // param is optional

// use routes
app.use('/api/v1', authRouter);

// render index page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

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

import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

//importing mongoose connection function
import dbConnection from './utils/db';

//importing error handling middleware
import errorHandler from './middlewares/errorHandler';

//importing routes
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import AppError from './utils/AppError';

const app = express();

// logging requests
app.use(morgan('dev'));

app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.disable('x-powered-by');

//setting up cors
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:5173'
    })
  );
}

if(process.env.NODE_ENV==='production'){
 app.use(
   cors({
     origin: '*'
   })
 );
}

//setting up database connection
dbConnection();

//setting routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

// catch 404 and forward to error handler
app.all('*', (req, res) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

// global error handler
app.use(errorHandler);

export default app;

import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

// handling mongoose cast eror while converting to object id
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// handling invalid JWT token error
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

// handlign JWT Token expired error
const handleJWTExpiredError = () =>
  new AppError('Your session has expired! Please log in again.', 401);

// sending errors during development
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  // sending erorr message with stack
  return res.status(err.statusCode).json({
    ...err,
    message: err.message,
    stack: err.stack
  });
};

// sending errors during production
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // trusted error send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // unknown error
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

// error handling middleware
export default (err: AppError, req: Request, res: Response, next: NextFunction) => {
  let error = {
    statusCode: err.statusCode || 500,
    status: err.status || 'error',
    isOperational: err.isOperational,
    message: err.message,
    name: err.name
  };
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res);
  }
};

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { HttpStatus } from '../Types/HttpStatus';
import asyncHandler from 'express-async-handler';

export default (schema: Joi.AnySchema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false
      });

      return next();
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        const errMsg = err.message.replace(/['"]+/g, '');
        throw new AppError(errMsg, HttpStatus.BAD_REQUEST);
      } else {
        throw new AppError('Something went wrong !', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  });

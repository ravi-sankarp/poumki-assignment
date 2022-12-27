import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { User } from '../models/userModel';
import AppError from '../utils/AppError';
import { HttpStatus } from '../Types/HttpStatus';
import jwtHelper from '../utils/JwtHelper';
import userService from '../services/userService';

//  middleware for checking if user is authorized

const userProtect = (role: 'user' | 'admin') => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) {
      //Get token from header
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new AppError('Please Login first', 401);
      }

      //verify token
      const id = await jwtHelper.verifyToken(token);

      // fetching user details with the id
      const userDetails = await userService.findUserById(id);

      // checking whether account was deleted
      if (!userDetails) {
        throw new AppError('User Account does not exists', HttpStatus.UNAUTHORIZED);
      }

      // check if user has the correct permission to access this route
      if (!userDetails.admin && role === 'admin') {
        throw new AppError('Not authorized to access this route', 401);
      }
      req.user = userDetails;
      next();
    } else {
      res.status(400);
      throw new AppError('Please login first', HttpStatus.UNAUTHORIZED);
    }
  });
};

export default userProtect;

import asyncHandler from 'express-async-handler';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserInterface from '../Types/UserInterface';
import AppError from '../utils/AppError';
import { HttpStatus } from '../Types/HttpStatus';
import passwordHelper from '../utils/PasswordHelper';
import userService from '../services/userService';
import jwtHelper from '../utils/JwtHelper';

const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!(email && password)) {
    throw new AppError('Please send all the data', HttpStatus.BAD_REQUEST);
  }

  //checking if account exists
  const user = await userService.findUserByEmailWithPwd(email);
  if (!user) {
    throw new AppError('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  // comparing plaintext password with hashed password from database
  const passwordCheck = await passwordHelper.comparePassword(password, user.password as string);
  if (!passwordCheck) {
    throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  // checking if user is admin to access this route
  if (!user.admin) {
    throw new AppError('Not authorized to access this route', HttpStatus.UNAUTHORIZED);
  }

  // sending jwt token as response
  res.json({
    status: 'Success',
    token: jwtHelper.generateToken(user._id),
    admin: true
  });
});

const getUserData = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.findAllUsers();
  res.json({
    status: 'Success',
    users
  });
});

const editUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, phoneNumber, firstName, lastName } = req.body;

  //checking if email already exists
  const user = await userService.checkEmailExists(email, id);
  if (user) {
    throw new AppError('Email already exists', HttpStatus.CONFLICT);
  }
  await userService.updateUserDetails(id, req.body);
  res.json({ status: 'Success' });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.id);
  res.json({ status: 'success' });
});

const getSingleUserData = asyncHandler(async (req: Request, res: Response) => {
  const userDetails: UserInterface | null = await userService.findUserById(req.params.id);
  res.json({
    id: userDetails?._id,
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    email: userDetails?.email
  });
});

const addNewUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = <UserInterface & { confirmPassword: string }>(
    req.body
  );

  //checking if email already exists
  const user = await userService.findUserByEmail(email);
  if (user) {
    throw new AppError('Email already exists', HttpStatus.CONFLICT);
  }
  await userService.createNewUser({
    email,
    firstName,
    lastName,
    password,
    admin: false
  });

  res.json({ status: 'Success' });
});

export default {
  adminLogin,
  getUserData,
  editUser,
  deleteUser,
  addNewUser,
  getSingleUserData
};

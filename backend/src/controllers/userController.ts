import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import passwordHelper from '../utils/PasswordHelper';
import UserInterface from '../Types/UserInterface';
import AppError from '../utils/AppError';
import { HttpStatus } from '../Types/HttpStatus';
import jwtHelper from '../utils/JwtHelper';
import userService from '../services/userService';

//@desc  handle userlogin
//@route POST /api/v1/user/login
//@access public
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  //checking if account exists
  const user: UserInterface | null = await userService.findUserByEmailWithPwd(email);
  if (!user) {
    res.status(401);
    throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
  } else if (await passwordHelper.comparePassword(password, user.password as string)) {
    res.json({
      status: 'Success',
      token: jwtHelper.generateToken(user._id),
      admin: false
    });
  } else {
    res.status(401);
    throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
});

//@desc  handle User registration
//@route POST /api/v1/user/register
//@access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = <UserInterface & { confirmPassword: string }>(
    req.body
  );

  // checking if email already exists
  const findUser: UserInterface | null = await userService.findUserByEmail(email);
  if (findUser) {
    throw new AppError('Email already exists', HttpStatus.CONFLICT);
  }

  // creating the new user in the database
  const result = await userService.createNewUser({
    email,
    firstName,
    lastName,
    password,
    admin: false
  });

  res.json({
    status: 'Success',
    token: jwtHelper.generateToken(result._id),
    admin: false
  });
});

//@desc  get user data
//@route GET /api/v1/user/getuserdata
//@access protected
const getUserData = asyncHandler(async (req: Request, res: Response) => {
  const { user } = req;
  res.json({
    id: user?._id,
    name: user?.firstName.concat(' ', user.lastName),
    email: user?.email
  });
});
export default {
  userLogin,
  registerUser,
  getUserData
};

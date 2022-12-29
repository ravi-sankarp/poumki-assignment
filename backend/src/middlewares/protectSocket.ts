import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import userService from '../services/userService';
import jwtHelper from '../utils/JwtHelper';

const protectSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        //verify token
        const id = await jwtHelper.verifyToken(token);

        // fetching user details with the id
        const user = await userService.findUserById(id);
        // checking whether account was deleted
        if (!user) {
          next(new Error('User Account does not exists'));
        }

        user!._id = id;
        socket.data = { ...socket.data, user };
        next();
      } catch (error) {
        console.error(error);
        next(new Error('Not authorized, Token is invalid'));
      }
    } else {
      next(new Error('Please login first'));
    }
  } catch (err: any) {
    next(new Error(err.message));
  }
};

export { protectSocket };

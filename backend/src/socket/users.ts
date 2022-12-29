import mongoose from 'mongoose';
import userProtect from '../middlewares/authMiddleware';

const users: {
  id: string;
  socketId: string;
  admin: boolean;
}[] = [];

// Join user to chat
export const userJoin = (id: string, socketId: string, admin = false) => {
  const user = { id: id.toString(), socketId, admin };
  users.push(user);

  return user;
};

export const getAdminUser = () => {
  return users.find((user) => !!user.admin);
};

// Get current user
export const getCurrentUser = (socketId: string) => {
  return users.find((user) => user.socketId === socketId);
};

// Get user by id
export const getUserById = (id: string) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
export const userLeave = (socketId: string) => () => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) {
    users.splice(index, 1)[0];
  }
};

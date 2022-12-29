import userType from './UserInterface';

declare global {
  namespace Express {
    interface Request {
      user?: userType;
    }
  }
}

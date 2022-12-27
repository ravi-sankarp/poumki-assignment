import { User } from '../models/userModel';
import IUser from '../Types/UserInterface';

// find a user with id
class UserService {
  async findUserById(id: string) {
    const user = await User.findById(id);
    return user;
  }

  // find a user with email
  async findUserByEmail(email: string) {
    const user = await User.findOne({ email });
    return user;
  }

  // find a user with email
  async findUserByEmailWithPwd(email: string) {
    const user = await User.findOne({ email }).select('+password');
    return user;
  }

  // find all users
  async findAllUsers() {
    const users = await User.find().select('-__v');
    return users;
  }

  // check if email already exists while updating
  async checkEmailExists(email: string, id: string) {
    const user = await User.findOne({ email, _id: id });
    return user;
  }

  // create a new user
  async createNewUser(user: Omit<IUser, '_id'>) {
    const result = await User.create(user);
    return result;
  }

  // update data of an existing user
  async updateUserDetails(id: string, user: Omit<IUser, '_id'>) {
    await User.findByIdAndUpdate(id, user, { runValidators: true });
  }

  // update data of an existing user
  async deleteUserById(id: string) {
    await User.findByIdAndDelete(id);
  }
}

const userService = new UserService();
export default userService;
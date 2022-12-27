interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  admin: boolean;
}

export default UserInterface;

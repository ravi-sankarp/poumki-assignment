import { model, Schema } from 'mongoose';
import UserInterface from '../Types/UserInterface';
import passwordHelper from '../utils/PasswordHelper';

export const userSchema = new Schema<UserInterface>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    minlength: [4, 'First name must be atleast 4 characters'],
    maxlength: [7, 'First name must be less than 8 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    maxlength: [7, 'Last name must be less than 9 characters']
  },
  email: {
    type: String,
    required: [true, 'Email field is required']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  admin: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', async function (next: (err?: Error) => void) {
  const document = this;
  if (document.isModified('password')) {
    document.password = await passwordHelper.hashPwd(this.password as string);
  }
  next();
});

userSchema.index(
  {
    email: 1
  },
  {
    unique: true
  }
);

export const User = model<UserInterface>('users', userSchema);

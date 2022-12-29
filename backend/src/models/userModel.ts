import { CallbackError, CallbackWithoutResultAndOptionalError, model, Schema } from 'mongoose';
import UserInterface from '../Types/UserInterface';
import passwordHelper from '../utils/PasswordHelper';
import getSocket from '../server';
import { getAdminUser } from '../socket/users';

export const userSchema = new Schema<UserInterface>(
  {
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
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      }
    }
  }
);

userSchema.index(
  {
    email: 1
  },
  {
    unique: true
  }
);

userSchema.pre('save', async function (next) {
  const document = this;
  document.$locals.isNew = document.isNew;
  if (document.isModified('password')) {
    document.password = await passwordHelper.hashPwd(this.password as string);
  }
  next();
});

userSchema.post('save', async function (doc, next) {
  if (doc.$locals.isNew) {
    const userDetails = doc.toObject();
    const admin = getAdminUser();
    if (admin) {
      getSocket().to(admin.id).emit('newuser-created', userDetails);
    }
  }

  next();
});

export const User = model<UserInterface>('users', userSchema);

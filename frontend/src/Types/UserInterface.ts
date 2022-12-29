export interface IAuth {
  data: {
    token: string;
    admin: boolean | null;
  };
}

export type TLoginApiResponse = IAuth['data'] & {
  message: string;
};

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload extends ILoginPayload {
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface IGetUserDataResponse {
  id: string;
  name: string;
  email: string;
}

export interface IUserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  admin: boolean;
  createdAt: Date;
}

export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
  data?: {
    status?: string;
  };
}

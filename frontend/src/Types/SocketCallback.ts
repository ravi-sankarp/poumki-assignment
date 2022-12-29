import { IUserInterface } from "./UserInterface";

export interface SocketArgument {
  status: 'success' | 'failed';
  message: string;
  data?: IUserInterface;
}

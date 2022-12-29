interface SocketArgument {
  status: 'success' | 'failed';
  message: string;
  data?: any;
}
export type SocketCallback = (res: SocketArgument) => void;

import { Server } from 'socket.io';

export class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: any) {
    super(httpServer, {
      //  path: '/api/v1/chat/',
      cors: {
        origin: '*'
      },
      allowEIO3: true
    });
  }

  public static getInstance(httpServer: any): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }
    console.log('Socket io running');
    return Websocket.io;
  }
}

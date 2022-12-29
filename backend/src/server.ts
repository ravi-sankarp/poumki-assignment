import { config } from 'dotenv';
import { createServer } from 'node:http';

//linking config file path
config({ path: './config.env' });

import app from './app';
import { protectSocket } from './middlewares/protectSocket';
import userService from './services/userService';
import { userJoin, userLeave, getUserById, getAdminUser } from './socket/users';
import { Websocket } from './socket/webSocket';
import { SocketCallback } from './Types/SocketCallbackInterface';
import IUser from './Types/UserInterface';

// creating a new http server with express application
const httpServer = createServer(app);

// setting up the socket io connection
const io = Websocket.getInstance(httpServer);

// protecting the socket connection with a middleware
io.use(protectSocket);

// Socket connection
io.on('connection', async (socket) => {
  const { user: user } = socket.data as { user: IUser };
  socket.join(user._id.toString());
  if (user.admin) {
    userJoin(user._id, socket.id, true);
    const users = await userService.findAllUsers();
    socket.emit('userlist', users);
  } else {
    userJoin(user._id, socket.id);
    const userDetails = await userService.findUserById(user._id);
    socket.emit('userdata', userDetails);
  }

  socket.on('admin-deleteuser', async (id, callback: SocketCallback) => {
    try {
      if (id) {
        await userService.deleteUserById(id);
        const foundUser = getUserById(id);
        if (foundUser) {
          socket.to(id).emit('accountdeleted');
        }
      }
      callback({ status: 'success', message: 'Deleted User' });
    } catch (err: any) {
      callback({ status: 'failed', message: err?.message });
    }
  });

  socket.on('admin-deleteallusers', async (callback: SocketCallback) => {
    try {
      const users = await userService.findAllUsers();
      await userService.deleteAllUsers();

      users.map((user) => {
        socket.to(user._id.toString()).emit('accountdeleted');
      });

      callback({
        status: 'success',
        message: 'Successfully deleted all users'
      });
    } catch (err: any) {
      callback({ status: 'failed', message: err?.message });
    }
  });

  socket.on('user-updated-data', async (data: IUser, id: string, callback: SocketCallback) => {
    try {
      if (!id || !data) {
        callback({
          status: 'failed',
          message: 'Please send all the necessary data'
        });
        return;
      }

      const user = await userService.checkEmailExists(data.email, id);
      if (user) {
        callback({
          status: 'failed',
          message: 'Email address already exists'
        });
        return;
      }
      const updatedData = await userService.updateUserDetails(id, data);

      const foundUser = getAdminUser();
      if (foundUser) {
        socket.to(foundUser.id).emit('user-updated-data', updatedData?.toObject());
      }
      callback({
        status: 'success',
        message: 'Successfully updated the user data'
      });
    } catch (err: any) {
      callback({ status: 'failed', message: err?.message });
    }
  });

  socket.on('admin-add-newuser', async (data: IUser, callback: SocketCallback) => {
    try {
      if (!data) {
        callback({
          status: 'failed',
          message: 'Please send all the necessary data'
        });
        return;
      }

      const user = await userService.findUserByEmail(data.email);
      if (user) {
        callback({
          status: 'failed',
          message: 'Email address already exists'
        });
        return;
      }
      const userDetails = await userService.createNewUser(data);
      const admin = getAdminUser();
      if (admin) {
        socket.to(admin.id).emit('newuser-added', userDetails.toObject());
      }

      callback({
        status: 'success',
        message: 'Successfully updated the user data'
      });
    } catch (err: any) {
      callback({ status: 'failed', message: err?.message });
    }
  });

  socket.on('admin-updated-data', async (data: IUser, id: string, callback: SocketCallback) => {
    try {
      if (!id || !data) {
        callback({
          status: 'failed',
          message: 'Please send all the necessary data'
        });
        return;
      }

      const user = await userService.checkEmailExists(data.email, id);
      if (user) {
        callback({
          status: 'failed',
          message: 'Email address already exists'
        });
        return;
      }
      const updatedData = await userService.updateUserDetails(id, data);
      const admin = getAdminUser();

      socket.to(id).emit('admin-updated-user', updatedData?.toObject());

      callback({
        status: 'success',
        message: 'Successfully updated the user data',
        data: updatedData
      });
    } catch (err: any) {
      callback({ status: 'failed', message: err?.message });
    }
  });

  socket.on('disconnect', userLeave(socket.id));
  socket.on('error', (err) => {
    console.log(err);
  });
});

// function for exporting the socket
const getSocket = () => {
  return io;
};

// getting port number from env
const port = process.env.port || 8000;

// listening on the specified port
const server = httpServer.listen(port, () => {
  console.log(`\n Server running on port ${port} \n`);
});

// logging unhandled rejection
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default getSocket;

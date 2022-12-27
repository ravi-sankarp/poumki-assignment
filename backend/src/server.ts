import { config } from 'dotenv';

//linking config file path
config({ path: './config.env' });

import app from './app';

// getting port number from env
const port = process.env.port || 8000;

// listening on the specified port
const server = app.listen(port, () => {
  console.log(`\nServer running on port ${port} \n`);
});

// logging unhandled rejection
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

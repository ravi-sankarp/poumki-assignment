import mongoose from 'mongoose';
const mongoUrl = process.env.DATABASE_LOCAL as string;

const dbConnection = async () => {
  try {
    await mongoose.connect(mongoUrl);
    // mongoose.set({ strict: true, strictQuery: true });
    console.log('DB connection successful!');
  } catch (err: any) {
    console.log(`Db Connection Failed ! ${err.message}`);
  }
};

export default dbConnection;

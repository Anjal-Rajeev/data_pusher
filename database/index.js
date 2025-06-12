import mongoose from 'mongoose';
import chalk from 'chalk';

import {
  ACCESS_TOKEN_SECRET,
  DATABASE_URL,
} from "../config.js";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET must be defined");
}


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.whiteBright('Database connection established'));
  } catch (err) {
    console.log(chalk.red('Error connecting to database:'), err.message);
    throw err;
  }
};

export default connectDB;

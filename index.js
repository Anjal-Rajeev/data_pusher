import express from "express"
import chalk from "chalk"
import cors from "cors";
import logger from "morgan"
import cookieParser from "cookie-parser";
import "dotenv/config";
import { PORT } from "./config.js";

import indexRouter from "./routes.js";

const app = express();

import { error } from "express-error-catcher";
import notFound from "./middleware/notFound.js";
import connectDB from "./database/index.js";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

app.use("/", indexRouter)

app.use(notFound)
app.use(error({log: "dev"}));


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(chalk.blueBright(`Server listening on port ${PORT}`));
    });
  } catch (err) {
    console.error("Error syncing database:", err);
  }
};

startServer();



export default app;
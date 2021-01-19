import "core-js/stable";
import "regenerator-runtime/runtime";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";

import urlAPIRouter from "./routes/urlAPIRoutes";
import { errorHandler, unknownEndpoint } from "./utils/errorHandler";
import userAPIRoutes from "./routes/userAPIRoutes";

dotenv.config();

const app = express();

console.log("Connecting to ", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.info("Successfully connected to Local MongoDB"))
  .catch((e) => console.info("Something bad happened", e));

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/", urlAPIRouter);
app.use("/user", userAPIRoutes);

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on 🚀 http://localhost:${PORT}/`);
});

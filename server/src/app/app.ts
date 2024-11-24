import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "../db/db";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "../routers/auth";
import employeeRouter from "../routers/employees";

config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("common"));
app.use(helmet());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employees", employeeRouter);

export const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

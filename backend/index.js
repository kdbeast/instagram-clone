import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
dotenv.config({});

const app = express();

app.get("/", (_, res) => {
  res.send("Hello World!");
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server started on port ${PORT}`);
});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.route.js";
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
  origin: "http://localhost:5174",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server started on port ${PORT}`);
});

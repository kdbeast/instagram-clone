import { app, server } from "./socket/socket.js";
import { connectToDB } from "./utils/db.js";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config({});

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

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server started on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Configuration for accepting json through express
app.use(express.json({ limit: "16kb" }));

// Data coming from url
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended means your can give nested objects

// Public assets used for storing files in the server
app.use(express.static("public"));

// Performing CRUD operations on user cookies
app.use(cookieParser());

export { app };

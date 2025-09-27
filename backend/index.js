import express from "express";
import dotenv, { config } from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import promptRoutes from "./routes/promptRoutes.js"
import { clerkMiddleware } from '@clerk/express'
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import cors from "cors";

dotenv.config();
const app = express()
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

app.use(express.json())
app.use(cookieParser())
app.use(clerkMiddleware())

mongoose.connect(MONGO_URL,  {
  serverSelectionTimeoutMS: 5000}).then(()=>{
    console.log("Connection Succesful");
}).catch((err)=>{
    console.error("Connection Error", err);
})

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promptRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./middleware/auth.js"
import { config } from 'dotenv';
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

config();
const { DB_HOST, PORT = 3000 } = process.env;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", auth, contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.connect(DB_HOST).then(() => {
  app.listen(PORT, () => {
    console.log("Server is running. Use our API on port: 3000");
  });
  console.log("Database connect successfully")
}).catch(error => {
  console.log(error.message);
  process.exit(1);
});

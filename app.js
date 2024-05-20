import express from "express";
import morgan from "morgan";
import cors from "cors";
import auth from "./middleware/auth.js"
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/api/contacts", auth, contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

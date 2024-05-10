import express from "express";
import { getUserInfo, loginUser, logoutUser, registerUser } from "../controllers/usersControllers.js";
import auth from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

usersRouter.post("/login", loginUser);

usersRouter.post("/logout", auth, logoutUser);

usersRouter.get("/current", auth, getUserInfo);

export default usersRouter;
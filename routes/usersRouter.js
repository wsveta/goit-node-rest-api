import express from "express";
import { getUserInfo, loginUser, logoutUser, registerUser, updateSubscription,updateAvatar } from "../controllers/usersControllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

usersRouter.post("/login", loginUser);

usersRouter.post("/logout", auth, logoutUser);

usersRouter.get("/current", auth, getUserInfo);

usersRouter.patch("/", auth, updateSubscription);

usersRouter.patch('/avatars', auth, upload.single("avatar"), updateAvatar);

export default usersRouter;
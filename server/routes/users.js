import express from "express";
import { createUser, loginUser, checkUserEmail } from "../controllers/users.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/check-email", checkUserEmail)
userRouter.post("/login", loginUser);




export default userRouter;
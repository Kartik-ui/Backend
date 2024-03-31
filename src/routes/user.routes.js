import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 }, // frontend should send file using avatar
    { name: "coverImage", maxCount: 1 }, // same as above
  ]),
  registerUser
);

export default router;

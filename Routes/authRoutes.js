const express = require("express");

const { signup, login, authentication } = require("../Controllers/authController");

const { verifyToken } = require("../MiddleWare/verifyToken");

const authRouter = express.Router();
const upload = require("../config/multerConfig");
const { uploadUserAvatar } = require("../MiddleWare/Media/UploadUserAvatar");


authRouter.post("/signup", upload.single("avatar"), uploadUserAvatar, signup);
authRouter.post("/login", login);
authRouter.post("/verify-token", verifyToken, authentication);

module.exports = authRouter;

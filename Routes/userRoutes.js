const express = require("express");
const { uploadUserAvatar } = require("../MiddleWare/Media/UploadUserAvatar");
const upload = require("../config/multerConfig")
const {
  getUser,
  updateUser,
  updateAvatar,
  handleFollowUnfollow,
  changePassword,
} = require("../Controllers/UserController");

const userRouter = express.Router();

userRouter.get("/:userId", getUser);
userRouter.put("/:userId", updateUser);
userRouter.put("/update-avatar/:userId", upload.single("avatar"), uploadUserAvatar, updateAvatar);
userRouter.put("/change-password/:userId", changePassword);
userRouter.post("/:userId/follow", handleFollowUnfollow);

module.exports = userRouter;

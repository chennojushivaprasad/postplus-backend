const express = require("express");
const { verifyToken } = require("../MiddleWare/verifyToken");
const {
  getPost,
  createPost,
  getAllPost,
  searchPosts,
  getMyPosts,
  updatePost,
} = require("../Controllers/postController");
const upload = require("../config/multerConfig");
const { uploadPostCoverImage } = require("../MiddleWare/Media/UploadPostCoverImage");

const postRouter = express.Router();



postRouter.get("/", verifyToken, getAllPost);
postRouter.get("/my-posts", verifyToken, getMyPosts);

postRouter.get("/search", verifyToken, searchPosts);
postRouter.get("/:postId", verifyToken, getPost);

postRouter.post(
  "/create",
  upload.single("coverImage"),
  uploadPostCoverImage,
  createPost
);

postRouter.put(
  "/:postId",
  verifyToken,
  upload.single("coverImage"),
  uploadPostCoverImage,
  updatePost
);


module.exports = postRouter;

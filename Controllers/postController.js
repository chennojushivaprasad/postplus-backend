const Post = require("../Model/PostSchema");

const getAllPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .populate("author")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getMyPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.user?._id;
  try {
    const totalPosts = await Post.countDocuments({ _id: userId });
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find({ _id: userId })
      .populate("author")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ posts, totalPages, totalPosts, currentPage: page });
  } catch (error) {
    console.error(error, "myposts");
    res.status(500).json({ error: "Server error" });
  }
};

const getPost = async (req, res) => {
  const postId = req.params?.postId;
  try {
    const post = await Post.findById(postId).populate("author");
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post Details", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  const { title, content, tags, author } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      tags,
      author,
      coverImage: req.coverImage,
    });
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;
  const postId = req.params.postId;
  try {
    const updatePostData = { title, content, tags, coverImage: req.coverImage };

    const updatedPost = await Post.findByIdAndUpdate(postId, updatePostData);

    res
      .status(201)
      .json({ message: "Post Upadated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error Updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchPosts = async (req, res) => {
  const { query, page, limit } = req.query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  try {
    if (!query)
      return res.status(200).json({ posts: [], totalPages: 0, currentPage: 1 });

    const regex = new RegExp(query, "i");

    const totalPosts = await Post.countDocuments({
      $or: [{ title: regex }, { content: regex }, { tags: { $in: [regex] } }],
    });
    const totalPages = Math.ceil(totalPosts / parsedLimit);

    const posts = await Post.find({
      $or: [{ title: regex }, { content: regex }],
    })
      .populate("author")
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    res.status(200).json({ posts, totalPages, currentPage: parsedPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.createPost = createPost;
module.exports.updatePost = updatePost;
module.exports.getPost = getPost;
module.exports.getAllPost = getAllPost;
module.exports.getMyPosts = getMyPosts;
module.exports.searchPosts = searchPosts;

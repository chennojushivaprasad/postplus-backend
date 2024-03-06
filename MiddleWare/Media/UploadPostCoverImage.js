const uploadImageToCloudinary = require("../uploadImageToCloudinary");

const uploadPostCoverImage = async (req, res, next) => {
  try {
    if (req?.file?.path) {
      const result = await uploadImageToCloudinary(req.file.path, {
        folder: "post",
      });
      req.coverImage = { url: result.url, public_id: result.public_id };
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.uploadPostCoverImage = uploadPostCoverImage;

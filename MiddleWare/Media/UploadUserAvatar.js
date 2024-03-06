const uploadImageToCloudinary = require("../uploadImageToCloudinary");

const uploadUserAvatar = async (req, res, next) => {
    try {
      if (req?.file?.path) {
        const result = await uploadImageToCloudinary(req.file.path, {
          folder: "profilePicture",
        });
        req.profilePicture = { url: result.url, public_id: result.public_id };
      } else {
        req.profilePicture = {
          url: "https://res.cloudinary.com/dzbwimcwr/image/upload/v1709545342/profilePicture/kpb8yjunhlhhxtxa1oyp.png",
          public_id: "profilePicture/kpb8yjunhlhhxtxa1oyp",
        };
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
module.exports.uploadUserAvatar = uploadUserAvatar  
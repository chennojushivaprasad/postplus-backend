const cloudinary = require("../config/CloudinaryConfig");

const uploadImageToCloudinary = async (imagePath,options={}) => {
  try {
    if (imagePath) {
      let result = await cloudinary.uploader.upload(imagePath,options);
      return result
    }
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
};

module.exports = uploadImageToCloudinary;

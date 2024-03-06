const cloudinary = require("../config/CloudinaryConfig");
const fs = require('fs');

const uploadImageToCloudinary = async (imagePath, options = {}) => {
  try {
    if (imagePath) {
      let result = await cloudinary.uploader.upload(imagePath, options);
      
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return;
        }
        console.log('File deleted successfully');
      });

      return result;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = uploadImageToCloudinary;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  profilePicture: {
    type: Object,
    required: true,
    default: {
      url: "https://res.cloudinary.com/dzbwimcwr/image/upload/v1709545342/profilePicture/kpb8yjunhlhhxtxa1oyp.png",
      public_id: "profilePicture/kpb8yjunhlhhxtxa1oyp",
    },
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("User", userSchema);

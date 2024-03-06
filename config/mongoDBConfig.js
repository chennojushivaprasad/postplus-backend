const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoDB_URL = process.env.MONGODB_URL;
    await mongoose.connect(mongoDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to database : MongoDb")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;

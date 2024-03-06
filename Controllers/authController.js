const User = require("../Model/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const expiresIn = process.env.expiresIn || "30d";

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { email, password, firstName, lastName, bio = "", fullName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      fullName,
      email,
      bio,
      password: hashedPassword,
      profilePicture: req.profilePicture,
    });
    await newUser.save();

    const token = jwt.sign({ user: newUser }, JWT_SECRET, { expiresIn });
    const userDetails = { ...newUser?._doc };
    delete userDetails["password"];
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn });

    const userDetails = { ...user?._doc };
    delete userDetails["password"];
    res
      .status(200)
      .json({ message: "Login successful", token, user: userDetails });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authentication = (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user,isValid:true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "" });
  }
};

module.exports.signup = signup;
module.exports.login = login;
module.exports.authentication = authentication;

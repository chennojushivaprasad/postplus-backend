const User = require("../Model/UserSchema");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "found user", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Invalid access: wrong password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "password doesn't match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      req.params.userId,
      { password: hashedPassword },
      {
        new: true,
      }
    );

    return res.status(200).json({ message: "password changed successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  const profilePicture = req.profilePicture;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {profilePicture}
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, message: "updated avatar" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleFollowUnfollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the follower is already following the user
    const isFollowing = user.followers.includes(followerId);

    if (isFollowing) {
      // If already following, unfollow
      user.followers = user.followers.filter(
        (id) => id.toString() !== followerId
      );
      follower.following = follower.following.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // If not following, follow
      user.followers.push(followerId);
      follower.following.push(userId);
    }

    await Promise.all([user.save(), follower.save()]);
    const message = isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully";
    return res.json({ success: true, message });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ success: false, message: "Failed to follow user" });
  }
};

module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.updateAvatar = updateAvatar;
module.exports.changePassword = changePassword;
module.exports.handleFollowUnfollow = handleFollowUnfollow;

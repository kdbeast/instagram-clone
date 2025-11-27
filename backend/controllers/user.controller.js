import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Incorrect password", success: false });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("token", "", { maxAge: 0 })
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to logout user" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user profile" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { gender, bio } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileuri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileuri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to edit user profile" });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({
      _id: { $ne: req.id },
    }).select("-password");

    if (!suggestedUsers)
      return res.status(404).json({ message: "No suggested users found" });

    res.status(200).json({ suggestedUsers, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get suggested users" });
  }
};

export const followAndUnfollowUser = async (req, res) => {
  try {
    const followerId = req.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
      return res
        .status(404)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = follower.following.some(
      (id) => id.toString() === followingId.toString()
    );

    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $pull: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $pull: { followers: followerId } }
        ),
      ]);
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $push: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $push: { followers: followerId } }
        ),
      ]);
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

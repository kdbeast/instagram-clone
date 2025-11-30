import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image is required" });

    // image upload optimization
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      imageType: image.mimetype,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    res
      .status(201)
      .json({ message: "Post created successfully", post, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    res.status(200).json({ posts, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });
    res.status(200).json({ posts, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // like logic
    await post.updateOne({ $addToSet: { likes: userId } });
    await post.save();

    // implement socket.io for real time notification

    res.status(200).json({ message: "Post liked successfully", success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // dislike logic
    await post.updateOne({ $pull: { likes: userId } });
    await post.save();

    // implement socket.io for real time notification

    res
      .status(200)
      .json({ message: "Post disliked successfully", success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(404).json({ message: "Comment is required" });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    }).populate({ path: "author", select: "username, profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", comment, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, profilePicture"
    );
    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }
    res.status(200).json({ comments, success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // delete post logic
    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((post) => post.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // bookmark logic
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post unbookmarked successfully",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked successfully",
        success: true,
      });
    }

    // implement socket.io for real time notification

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const unbookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // unbookmark logic
    const user = await User.findById(userId);
    if (!user.bookmarks.includes(postId)) {
      return res.status(400).json({ message: "Post not bookmarked" });
    }
    user.bookmarks = user.bookmarks.filter(
      (post) => post.toString() !== postId
    );
    await user.save();

    // implement socket.io for real time notification

    res
      .status(200)
      .json({ message: "Post unbookmarked successfully", success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

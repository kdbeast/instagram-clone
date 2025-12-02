import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  editProfile,
  getSuggestedUser,
  followAndUnfollowUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePhoto"), editProfile);
router.route("/suggested-users").get(isAuthenticated, getSuggestedUser);
router
  .route("/followorunfollow/:id")
  .post(isAuthenticated, followAndUnfollowUser);

export default router;

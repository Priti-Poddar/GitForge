const express = require("express");
const userController = require("../controllers/userController");
const followController = require("../controllers/followerController");
const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.put("/user/follow/:id", followController.followUser);
userRouter.put("/user/unfollow/:id", followController.unfollowUser);

module.exports = userRouter; 
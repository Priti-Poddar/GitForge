const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },

    // ── Social ──
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    repositories: [
      {
        default: [],
        type: Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
    followedUsers: [
      {
        default: [],
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    starRepos: [
      {
        default: [],
        type: Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
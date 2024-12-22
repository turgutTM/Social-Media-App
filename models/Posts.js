import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;

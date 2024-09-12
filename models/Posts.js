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
    comments: [
      {
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

PostSchema.path("comments").default(() => []);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;

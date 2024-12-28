import { NextResponse } from "next/server";
import connect from "../../../db";
import Comment from "../../../models/Comment";
import Post from "../../../models/Posts";

export const DELETE = async (request) => {
  try {
    await connect();

    const { commentId } = await request.json();

    if (!commentId) {
      return new NextResponse("Missing required fields (commentId)", {
        status: 400,
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    const post = await Post.findById(comment.postID);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await post.save();
    }

    await Comment.deleteOne({ _id: commentId });

    return new NextResponse("Comment deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

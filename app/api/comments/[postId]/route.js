import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";
import mongoose from "mongoose";

export const GET = async (req) => {
  try {
    await connect();
    const postId = req.url.split("/").pop();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return new NextResponse("Invalid or missing Post ID", { status: 400 });
    }

    const post = await Post.findById(postId).populate(
      "comments.userID",
      "name profilePhoto"
    );

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(post.comments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};

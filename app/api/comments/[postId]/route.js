import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";
import mongoose from "mongoose";

export const GET = async (req) => {
  try {
    await connect();
    const postId = req.url.split("/").pop();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return new NextResponse("Invalid or missing Post ID", {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return new NextResponse("Post not found", {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const comments = post.comments.map((comment) => ({
      name: comment.name,
      profilePhoto: comment.profilePhoto,
      comment: comment.comment,
      createdAt: comment.createdAt,
    }));

    return new NextResponse(JSON.stringify(comments), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching comments for post ID", postId, ":", error);
    return new NextResponse("Server error", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

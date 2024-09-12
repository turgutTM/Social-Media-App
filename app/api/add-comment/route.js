import { NextResponse } from "next/server";
import connect from "../../../db";
import Post from "../../../models/Posts";
import User from "../../../models/User";

export const POST = async (request) => {
  const { postID, userID, comment } = await request.json();

  if (!postID || !userID || !comment) {
    return new NextResponse(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findById(userID);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID" }),
        { status: 404 }
      );
    }

    const post = await Post.findById(postID);

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid post ID" }),
        { status: 404 }
      );
    }

    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }

    const newComment = {
      userID: user._id,
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);

    await post.save();

    
    return new NextResponse(
      JSON.stringify({
        message: "Comment added successfully",
        comments: post.comments,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Add comment error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

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
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 404,
      });
    }

    const newComment = {
      userID: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto || "default-profile-photo-url.jpg",
      comment,
      createdAt: new Date(),
    };

   
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { $push: { comments: newComment } },
      { new: true } 
    );

    if (!updatedPost) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid post ID" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Comment added successfully",
        comments: updatedPost.comments,
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

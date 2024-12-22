import { NextResponse } from "next/server";
import connect from "../../../db";
import Comment from "../../../models/Comment";
import User from "../../../models/User";
import Post from "../../../models/Posts";

export const POST = async (request) => {
  try {
    await connect();

    const { postID, userID, comment } = await request.json();

    if (!postID || !userID || !comment) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await User.findById(userID);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const newComment = new Comment({
      postID,
      userID,
      comment,
    });
    await newComment.save();

    const post = await Post.findById(postID);
    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }
    post.commentCount += 1;
    await post.save();

    const responseContent = JSON.stringify({
      postID: newComment.postID,
      userID: newComment.userID,
      comment: newComment.comment,
      user: {
        name: user.name,
        profilePhoto: user.profilePhoto || "/defaultpicture.jpg",
      },
    });

    return new NextResponse(responseContent, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

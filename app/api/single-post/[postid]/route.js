// pages/api/posts/[postid].js
import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";
import User from "../../../../models/User";

export const GET = async (request, { params }) => {
  try {
    await connect();

    const postID = params.postid;

    const post = await Post.findById(postID).lean();

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    const user = await User.findById(post.userID).lean();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const result = {
      post,
      user,
    };

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

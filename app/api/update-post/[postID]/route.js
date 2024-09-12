import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";

export const PUT = async (req, { params }) => {
  try {
    await connect();

    const postID = params.postID; 
    const { content } = await req.json();

    if (!content) {
      return new NextResponse("Content is not found", { status: 404 });
    }

    const post = await Post.findByIdAndUpdate(
      postID,
      { content },
      { new: true }
    );

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

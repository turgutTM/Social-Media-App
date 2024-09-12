import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";

export const DELETE = async (req) => {
  try {
    await connect();
    const postID = req.url.split("/").pop();

    if (!postID) {
      return new NextResponse("Post ID is required", { status: 400 });
    }

    const deletedPost = await Post.findByIdAndDelete(postID);

    if (!deletedPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(deletedPost), { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};

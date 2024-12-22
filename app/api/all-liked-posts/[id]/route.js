import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";

export const GET = async (request) => {
  try {
    await connect();

    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "userID is required" }),
        { status: 400 }
      );
    }

    const posts = await Post.find({ userID: id }, "imgURL likedBy").populate({
      path: "likedBy",
      select: "name profilePhoto",
      options: { lean: true },
    });

    if (!posts || posts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No posts found or no liked posts" }),
        { status: 404 }
      );
    }

    const processedPosts = posts.map((post) => ({
      imgURL: post.imgURL,
      likedUsers: post.likedBy.map((user) => ({
        name: user.name,
        profilePhoto: user.profilePhoto,
      })),
    }));

    return new NextResponse(JSON.stringify(processedPosts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

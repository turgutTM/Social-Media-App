import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";
import User from "../../../../models/User";


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

    const posts = await Post.find({ userID: id }).populate({
      path: "likedBy",
      select:
        "email name profilePhoto bio live school worksAt wentTo link joinedAt",
      options: { lean: true },
    });

    const postsWithLikes = posts.filter((post) => post.likedBy.length > 0);

    if (postsWithLikes.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No posts with likes found" }),
        { status: 404 }
      );
    }

    const userIdsWithLikes = postsWithLikes.flatMap((post) =>
      post.likedBy.map((user) => user._id)
    );

    const uniqueUserIds = [...new Set(userIdsWithLikes)];
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select(
        "email name profilePhoto bio live school worksAt wentTo link joinedAt"
      )
      .lean();

    return new NextResponse(JSON.stringify({ posts: postsWithLikes, users }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

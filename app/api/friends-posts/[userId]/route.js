import { NextResponse } from "next/server";
import connect from "../../../../db";
import User from "../../../../models/User";
import Post from "../../../../models/Posts";

export const GET = async (request) => {
  try {
    await connect();

    const userId = request.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userId is required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate({
      path: "friends",
      select: "_id",
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const friendIds = user.friends.map((friend) => friend._id);

    const posts = await Post.find({ userID: { $in: friendIds } });

    const userIDs = [...new Set(posts.map((post) => post.userID.toString()))];

    const users = await User.find({ _id: { $in: userIDs } });

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const postsWithUser = posts.map((post) => ({
      ...post.toObject(),
      user: userMap[post.userID.toString()] || null,
    }));

    return new NextResponse(JSON.stringify(postsWithUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

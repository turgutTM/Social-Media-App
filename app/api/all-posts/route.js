import { NextResponse } from "next/server";
import connect from "../../../db";
import Post from "../../../models/Posts";
import User from "../../../models/User";

export const GET = async (request) => {
  try {
    await connect();

    const posts = await Post.find();

    const userIDs = [...new Set(posts.map((post) => post.userID))];

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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

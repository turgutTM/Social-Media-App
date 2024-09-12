import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";
import User from "../../../../models/User";

export const GET = async (request) => {
  try {
    await connect();

    // Extract userID from the request URL
    const userID = request.nextUrl.pathname.split('/').pop();

    // Fetch posts based on userID or get all posts
    const posts = userID ? await Post.find({ userID }) : await Post.find();

    // Extract unique user IDs from the posts
    const userIDs = [...new Set(posts.map((post) => post.userID))];

    // Fetch user details for the extracted user IDs
    const users = await User.find({ _id: { $in: userIDs } });

    // Create a mapping of user IDs to user details
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    // Combine posts with their corresponding user details
    const postsWithUser = posts.map((post) => ({
      ...post.toObject(),
      user: userMap[post.userID.toString()] || null, // Attach user object or null if not found
    }));

    // Return the combined posts and user details
    return new NextResponse(JSON.stringify(postsWithUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

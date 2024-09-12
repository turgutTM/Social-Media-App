import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";


export const POST = async (request) => {
  try {
    await connect();

    const { userId, followId } = await request.json();

    if (!userId || !followId) {
      return new NextResponse(
        JSON.stringify({ message: "Both userId and followId are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (user.follows.includes(followId)) {
      return new NextResponse(
        JSON.stringify({ message: "You are already following this user" }),
        { status: 400 }
      );
    }

    user.following.push(followId);
    await user.save();

  
    followUser.follows.push(userId);
    await followUser.save();

    return new NextResponse(
      JSON.stringify({ message: "You are now following this user" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};


export const DELETE = async (request) => {
  try {
    await connect();

    const { userId, followId } = await request.json();

    if (!userId || !followId) {
      return new NextResponse(
        JSON.stringify({ message: "Both userId and followId are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (!user.follows.includes(followId)) {
      return new NextResponse(
        JSON.stringify({ message: "You are not following this user" }),
        { status: 400 }
      );
    }

    user.follows = user.follows.filter((id) => id !== followId);
    await user.save();

    followUser.following = followUser.following.filter((id) => id !== userId);
    await followUser.save();

    return new NextResponse(
      JSON.stringify({ message: "You have unfollowed this user" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

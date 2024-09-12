import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userId, blockUserId } = await request.json();
    console.log("Received request to block user", { userId, blockUserId });

    if (!userId || !blockUserId) {
      return new NextResponse("User ID or Block User ID is missing", {
        status: 400,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found", { userId });
      return new NextResponse("User not found", { status: 404 });
    }

    const blockUser = await User.findById(blockUserId);
    if (!blockUser) {
      console.log("User to block not found", { blockUserId });
      return new NextResponse("User to block not found", { status: 404 });
    }

    if (user.blockedUsers.includes(blockUserId)) {
      console.log("User already blocked", { blockUserId });
      return new NextResponse("User already blocked", { status: 400 });
    }

    user.blockedUsers.push(blockUserId);
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "User blocked successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

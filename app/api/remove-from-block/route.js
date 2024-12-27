import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userId, unblockUserId } = await request.json();
    console.log("Received request to unblock user", { userId, unblockUserId });

    if (!userId || !unblockUserId) {
      return new NextResponse("User ID or Unblock User ID is missing", {
        status: 400,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found", { userId });
      return new NextResponse("User not found", { status: 404 });
    }

    if (!user.blockedUsers.includes(unblockUserId)) {
      console.log("User is not in blocked list", { unblockUserId });
      return new NextResponse("User is not in blocked list", { status: 400 });
    }

    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== unblockUserId);
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "User unblocked successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

import { NextResponse } from "next/server";
import connect from "../../../db";
import User from "../../../models/User";

export const POST = async (request) => {
  try {
    await connect();
    const { userId, isDark } = await request.json();

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isDark },
      { new: true }
    );

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error updating dark mode setting:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

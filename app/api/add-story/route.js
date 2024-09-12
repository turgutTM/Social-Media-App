import { NextResponse } from "next/server";
import connect from "../../../../db";
import User from "../../../../models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userId, media } = await request.json();

    if (!userId || !media) {
      return new NextResponse(
        JSON.stringify({ message: "userId and media are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    
    user.story.push(media);
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "Story shared successfully", story: user.story }),
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

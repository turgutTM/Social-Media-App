// pages/api/stories/update.js
import { NextResponse } from "next/server";
import connect from "../../../../db";
import Story from "../../../../models/Story";
import User from "../../../../models/User";

export const POST = async (request) => {
  try {
    await connect();

    const { userID, mediaURL } = await request.json();

    if (!userID || !mediaURL) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    
    const user = await User.findById(userID).lean();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const story = await Story.create({ userID, mediaURL });



    return new NextResponse(JSON.stringify(story), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

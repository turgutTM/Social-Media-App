import Notification from "../../../../models/Notification";
import { NextResponse } from "next/server";
import connect from "../../../../db";
export const GET = async (request) => {
  await connect();

  const userId = request.url.split("/").pop();

  if (!userId) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  try {
    const notifications = await Notification.find({ receiverId: userId }).sort({
      createdAt: -1,
    });

    return new NextResponse(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

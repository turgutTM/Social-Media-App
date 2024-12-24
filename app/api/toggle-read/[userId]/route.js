import { NextResponse } from "next/server";
import Notification from "../../../../models/Notification";
import connect from "../../../../db";

export const PUT = async (request) => {
  await connect();

  const userId = request.url.split("/").pop();

  if (!userId) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  try {

    const result = await Notification.updateMany(
      { receiverId: userId },
      { $set: { read: true } }
    );

    return new NextResponse(
      JSON.stringify({ message: "Notifications marked as read", result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

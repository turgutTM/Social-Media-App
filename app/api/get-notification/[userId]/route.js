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
    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .populate("senderId", "name profilePhoto");   

    const formattedNotifications = notifications.map((notification) => {
      const { type,read, content, senderId, postID, createdAt } = notification;
      return {
        id: notification._id,
        senderName: senderId.name,
        senderPhoto: senderId.profilePhoto,
        messageBody: content.text.replace(senderId.name, "").trim(),
        type,
        postID,
        createdAt,
        read
      };
    });

    return new NextResponse(JSON.stringify(formattedNotifications), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

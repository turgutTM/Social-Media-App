import { NextResponse } from "next/server";
import connect from "../../../db";
import Notification from "../../../models/Notification";
import User from "../../../models/User";

export const POST = async (request) => {
  await connect();
  const { receiverId, senderId, type,postID } = await request.json();

  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      return new NextResponse(JSON.stringify({ message: "Sender not found" }), {
        status: 404,
      });
    }

    const content = createNotificationContent(
      type,
      sender.name,
      sender.profilePhoto
    );

    const newNotification = new Notification({
      receiverId,
      senderId,
      type,
      content: {
        text: content.text,
        photo: content.photo
      },
      postID
    });

    await newNotification.save();

    return new NextResponse(
      JSON.stringify({ message: "Notification sent successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

function createNotificationContent(type, senderName, senderPhoto) {
  switch (type) {
    case "like":
      return { text: `${senderName} liked your post`, photo: senderPhoto };
    case "comment":
      return { text: `${senderName} commented on your post`, photo: senderPhoto };
    case "friend_request":
      return { text: `${senderName} sent you a friend request`, photo: senderPhoto };
    case "follow":
      return { text: `${senderName} started following you`, photo: senderPhoto };
    default:
      return { text: "You have a new notification", photo: senderPhoto };
  }
}

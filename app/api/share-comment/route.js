import { NextResponse } from "next/server";
import connect from "../../../db";
import Comment from "../../../models/Comment";

export const POST = async (request) => {
  try {
    await connect();

    const { postID, userID, comment } = await request.json();

    if (!postID || !userID || !comment) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newComment = new Comment({
      postID,
      userID,
      comment,
    });

    await newComment.save();

    return new NextResponse(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

import { NextResponse } from "next/server";
import connect from "../../../db";
import Post from "../../../models/Posts";

export const POST = async (req) => {
  try {
    await connect();
    const { userID, imgURL, content, title, likes } = await req.json();

    if (!userID || !content || !title  ) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newPost = new Post({ userID, imgURL, content, title, likes });
    await newPost.save();

    return new NextResponse(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};

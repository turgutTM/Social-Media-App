import { NextResponse } from "next/server";
import connect from "../../../../db";
import Comment from "../../../../models/Comment";
import User from "../../../../models/User";

export const GET = async (request) => {
  try {
    await connect();

    const postID = request.url.split("/").pop();
    console.log(postID);
  

    if (!postID) {
      return new NextResponse("Missing postID", { status: 400 });
    }

    const comments = await Comment.find({ postID });

    const detailedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userID);
        return {
          ...comment.toObject(),
          user: {
            name: user?.name || "Unknown",
            profilePhoto: user?.profilePhoto || null,
          },
        };
      })
    );

    return new NextResponse(JSON.stringify(detailedComments), { status: 200 });
  
    
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

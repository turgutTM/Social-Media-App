import { NextResponse } from "next/server";
import connect from "../../../../db";
import Post from "../../../../models/Posts";

export async function PATCH(request, { params }) {
  try {
    await connect();
    const postID = params.postID;
    const { userID } = await request.json();
    const post = await Post.findById(postID);

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (!post.likedBy.includes(userID)) {
      post.likes += 1;
      post.likedBy.push(userID);
    }

    const updatedPost = await post.save();

    return new NextResponse(JSON.stringify({ likes: updatedPost.likes }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connect();
    const postID = params.postID;
    const { userID } = await request.json();
    const post = await Post.findById(postID);

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (post.likedBy.includes(userID)) {
      post.likes -= 1;
      post.likedBy.pull(userID);
    }

    const updatedPost = await post.save();

    return new NextResponse(JSON.stringify({ likes: updatedPost.likes }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

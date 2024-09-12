import { NextResponse } from 'next/server';
import connect from '../../../../db';
import Post from '../../../../models/Posts';
import User from '../../../../models/User';

export const GET = async (request) => {
  try {
    await connect();

   
    const userId = request.nextUrl.pathname.split('/').pop();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: 'userID is required' }),
        { status: 400 }
      );
    }

   
    const posts = await Post.find({ userID: userId }).populate({
      path: 'likedBy',
      select: 'email name profilePhoto bio live school worksAt wentTo link joinedAt',
      options: { lean: true }
    });

    // likedBy dizisi dolu olan postları filtrele
    const postsWithLikes = posts.filter(post => post.likedBy.length > 0);

    if (postsWithLikes.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'No posts with likes found' }),
        { status: 404 }
      );
    }

    // likedBy dizisindeki tüm kullanıcı ID'lerini al
    const userIdsWithLikes = postsWithLikes.flatMap(post => post.likedBy.map(user => user._id));

    // Kullanıcı ID'lerine göre tüm kullanıcıları al
    const uniqueUserIds = [...new Set(userIdsWithLikes)]; // Kullanıcı ID'lerini benzersiz hale getir
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select('email name profilePhoto bio live school worksAt wentTo link joinedAt')
      .lean();

    return new NextResponse(
      JSON.stringify({ posts: postsWithLikes, users }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
};

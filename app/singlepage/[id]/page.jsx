"use client"
import React, { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

const SinglePage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/single-post/${id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  if (error) return <div className='flex justify-center items-center h-screen'>Error: {error}</div>;
  if (!post) return <div className='flex justify-center items-center h-screen'>No post found</div>;

  return (
    <div className='container flex justify-center items-center mx-auto p-4'>
      <div className='bg-white rounded-lg shadow-lg p-6'>
        {post.user && (
          <div className='flex items-center gap-4 mb-4'>
            <img src={post.user.profilePhoto || '/defaultprofile.jpg'} alt="User Profile" className='w-12 h-12 rounded-full object-cover' />
            <h2 className='text-lg font-semibold'>{post.user.name}</h2>
          </div>
        )}
        {post.imgURL && (
          <img src={post.post.imgURL} alt="Post Image" className='rounded-lg w-full h-auto mb-4' />
        )}
        <h1 className='text-2xl font-bold mb-2'>{post.post.title}</h1>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default SinglePage;

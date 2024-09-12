"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineScience } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { MdOutlinePlayLesson } from "react-icons/md";
import { FaRegComment, FaShareAlt } from "react-icons/fa";
import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

const SinglePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/single-post/${id}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={70} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load data</div>;
  }

  const { post, user } = data;

  return (
    <div className="flex gap-5 ml-8 justify-center p-3">
      <div className="flex h-screen flex-col w-8/12">
        <div className="relative">
          <img
            className="h-[23rem] w-full object-cover rounded-md"
            src={post.imgURL || "https://via.placeholder.com/600x400"}
            alt="Main"
          />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <img
              className="w-20 h-20 rounded-full object-cover border-4"
              src={user.profilePhoto || "https://via.placeholder.com/100"}
              alt="Overlay"
            />
          </div>
        </div>
        <div className="flex justify-center mt-12 text-lg text-gray-400">
          <p className="mr-3">@{user.name}</p>
        </div>
        <div className="mt-12 flex justify-center">
          <p className="text-3xl w-5/6 font-bold text-center text-red-400">
            {post.content}
          </p>
        </div>
        <div className="flex justify-center items-center text-gray-500 gap-6 mt-6">
          <div className="flex flex-col items-center p-3 border rounded-lg shadow-lg bg-white">
            <MdOutlineScience size={24} />
            <p className="mt-1 text-sm">Science</p>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-lg shadow-lg bg-white">
            <CiTimer size={24} />
            <p className="mt-1 text-sm">Timing</p>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-lg shadow-lg bg-white">
            <MdOutlinePlayLesson size={24} />
            <p className="mt-1 text-sm">Lessons</p>
          </div>
        </div>
        <div className="mt-10 text-justify text-gray-700">
          <p>{post.content}</p>
        </div>
        <div className="flex justify-center items-center text-gray-500 gap-6 mt-10">
          <div className="flex items-center gap-2 cursor-pointer">
            <FaRegComment size={20} />
            <span className="text-sm">Comment</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <FaShareAlt size={20} />
            <span className="text-sm">Share</span>
          </div>
        </div>
      </div>
      <div className="bg-white border-2 h-fit w-3/12 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Latest Blogs</h2>
        <div className="mb-4 p-3 bg-white rounded-lg shadow-lg">
          <h3 className="text-md font-semibold text-gray-600">Blog Title 1</h3>
          <p className="text-sm text-gray-500">
            Short description of the first blog post...
          </p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-lg">
          <h3 className="text-md font-semibold text-gray-600">Blog Title 2</h3>
          <p className="text-sm text-gray-500">
            Short description of the second blog post...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;

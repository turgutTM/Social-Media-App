"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/all-posts");
        if (response.ok) {
          const posts = await response.json();
          setPosts(posts);
        } else {
          console.error("Failed to fetch posts");   
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <select id="category" className="border p-2 rounded">
            <option value="" disabled selected hidden>
              Select a category
            </option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        <div className="flex flex-col items-center">
          <select id="date" className="border p-2 rounded">
            <option value="" disabled selected hidden>
              Select a time frame
            </option>
            <option value="allpost">All posts</option>
            <option value="1week">1 Week Ago</option>
            <option value="1month">1 Month Ago</option>
            <option value="6months">6 Months Ago</option>
            <option value="1year">1 Year Ago</option>
          </select>
        </div>
      </div>
      <div className="flex gap-20 justify-center mt-10 flex-wrap">
        {posts.map((post) => (
          <div
            key={post._id}
            className="w-[23rem] flex flex-col shadow-md border border-[#bebdbd] rounded-lg bg-white"
          >
            <div>
              <img className="rounded-lg" src={post.imgURL} alt="Post" />
            </div>
            <div className="flex flex-col p-4 gap-5">
              <div className="mt-5 ">{post.title}</div>
              <div>
                <Link href={`/singlepage/${post._id}`}>
                  <button className="bg-red-400 mt-4 justify-center p-1.5 text-white rounded-xl w-full">
                    Read more
                  </button>
                </Link>
              </div>
              <div className="mt-5 flex w-full justify-center font-light text-gray-400 ">
                @{post.user.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;

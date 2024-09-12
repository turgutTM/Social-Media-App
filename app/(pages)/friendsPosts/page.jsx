"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FriendsPosts = () => {
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [hoveredUser, setHoveredUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const router = useRouter();

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      try {
        const response = await axios.get(`/api/friends-posts/${user._id}`);
        if (response.status === 200) {
          setFriendsPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching friends' posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      fetchFriendsPosts();
    }
  }, [user._id]);

  useEffect(() => {
    if (!user || !user._id) {
      toast.warning("You need to login first");
      router.push("/login");
    }
  }, [user, router]);

  const handleLike = async (postID) => {
    try {
      const method = likedPosts[postID] ? "DELETE" : "PATCH";
      const response = await axios({
        method,
        url: `/api/like-post/${postID}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { userID: user._id },
      });
      if (response.status === 200) {
        const updatedPost = response.data;
        setFriendsPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postID ? { ...post, likes: updatedPost.likes } : post
          )
        );
        setLikedPosts((prevLikes) => ({
          ...prevLikes,
          [postID]: !prevLikes[postID],
        }));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const fetchHoveredUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      if (response.status === 200) {
        setHoveredUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching hovered user data:", error);
    }
  };

  const handleMouseEnter = (userId, event) => {
    fetchHoveredUserData(userId);
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={70} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!friendsPosts.length) {
    return (
      <p
        className={`${
          isDarkMode ? "text-gray-500 text-center " : "text-gray-700"
        }  py-4 flex justify-center items-center h-screen`}
      >
        You have no friend in your friends list or they have not been shared anything yet
      </p>
    );
  }

  return (
    <div
      className={`relative flex flex-col w-full p-4 shadow-md gap-14 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {hoveredUser && (
        <div
          className={`absolute border rounded-lg p-4 w-1/4 z-10 left-0 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200"
          }`}
          style={{ top: 10, left: 4 }}
        >
          <div className="flex flex-col items-center gap-4 border-b pb-4 mb-4">
            <img
              className="w-24 h-24 rounded-full object-cover border"
              src={
                hoveredUser.profilePhoto ||
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Profile"
            />
            <p className="font-medium text-lg">{hoveredUser.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border-b pb-2">
              <span className="font-medium">Email:</span>
              <span className="text-sm text-gray-500">{hoveredUser.email}</span>
            </div>
            <div className="flex items-center gap-2 border-b pb-2">
              <span className="font-medium">Location:</span>
              <span className="text-sm text-gray-500">{hoveredUser.live}</span>
            </div>
            <div className="flex items-center gap-2 border-b pb-2">
              <span className="font-medium">School:</span>
              <span className="text-sm text-gray-500">
                {hoveredUser.school}
              </span>
            </div>
            <div className="flex items-center gap-2 border-b pb-2">
              <span className="font-medium">Works At:</span>
              <span className="text-sm text-gray-500">
                {hoveredUser.worksAt}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Went To:</span>
              <span className="text-sm text-gray-500">
                {hoveredUser.wentTo}
              </span>
            </div>
          </div>
        </div>
      )}
      {friendsPosts.map((post) => (
        <div key={post._id} className="flex justify-center">
          <div
            className={`flex w-6/12 flex-col gap-7 p-5 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex gap-4 justify-between">
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <img
                  className="w-12 h-12 flex justify-center rounded-full object-cover border"
                  src={
                    post.user.profilePhoto ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="Profile"
                />
                <div className="flex flex-col gap-1">
                  <p
                    className={`font-medium flex justify-center cursor-pointer mr-1 ${
                      isDarkMode ? "text-white" : ""
                    }`}
                    onMouseEnter={(e) => handleMouseEnter(post.user._id, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() =>
                      (window.location.href = `/profile/${post.user._id}`)
                    }
                  >
                    {post.user ? post.user.name : "Unknown User"}
                  </p>
                  <p
                    className={`text-xs flex justify-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                className="w-full h-auto rounded-lg mb-4 shadow-md cursor-pointer"
                src={post.imgURL}
                alt="Post"
                onClick={() =>
                  (window.location.href = `/singlepage/${post._id}`)
                }
              />
            </div>
            <div className="mt-3">
              <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
                {post.content}
              </p>
            </div>
            <div className="mt-8 flex justify-between">
              <div className="flex gap-7">
                <div
                  className={`flex items-center gap-4 p-2 rounded-3xl cursor-pointer ${
                    likedPosts[post._id]
                      ? "bg-blue-100 text-blue-600"
                      : isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  <AiOutlineLike className="text-lg" />
                  <p>{post.likes} likes</p>
                </div>
                <div
                  className={`flex items-center gap-4 p-2 rounded-3xl ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaRegComments className="text-lg" />
                  <p>0 comments</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-4 p-2 pl-4 pr-4 rounded-3xl ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <RiShareForwardLine className="text-lg" />
                <p>Share</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsPosts;

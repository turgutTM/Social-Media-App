"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdatePostModal from "../components/UpdatePostModal";
import { useRouter } from "next/navigation";

const Feed = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [activeCommentsPostID, setActiveCommentsPostID] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/all-posts");
        if (response.ok) {
          const posts = await response.json();
          setPosts(posts);

          const storedLikes =
            JSON.parse(localStorage.getItem("likedPosts")) || {};
          const userLikedPosts = {};
          posts.forEach((post) => {
            userLikedPosts[post._id] = post.likedBy.includes(user._id);
          });
          setLikedPosts(userLikedPosts);
          localStorage.setItem("likedPosts", JSON.stringify(userLikedPosts));
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user._id]);

  const handleLike = async (postID) => {
    const isLiked = likedPosts[postID];
    const newLikedPosts = { ...likedPosts, [postID]: !isLiked };
    setLikedPosts(newLikedPosts);

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postID
          ? {
              ...post,
              likes: isLiked ? post.likes - 1 : post.likes + 1,
              likedBy: isLiked
                ? post.likedBy.filter((id) => id !== user._id)
                : [...post.likedBy, user._id],
            }
          : post
      )
    );

    try {
      const method = isLiked ? "DELETE" : "PATCH";
      const response = await fetch(`/api/like-post/${postID}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user._id }),
      });
      if (!response.ok) {
        throw new Error("Failed to like/unlike post");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };
  const handleCommentChange = (postID, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postID]: value,
    }));
  };
  const handleDelete = async (postID) => {
    try {
      const response = await fetch(`/api/delete-post/${postID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postID)
        );
        toast.success("Post deleted successfully");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleSendComment = async (e, postID) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postID,
          userID: user._id,
          comment: comments[postID],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postID ? { ...post, comments: result.comments } : post
          )
        );
        setComments((prevComments) => ({
          ...prevComments,
          [postID]: "",
        }));
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleViewComments = async (postID) => {
    setActiveCommentsPostID((prevID) => (prevID === postID ? null : postID));

    try {
      const response = await fetch(`/api/comments/${postID}`);
      if (response.ok) {
        const commentsData = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postID ? { ...post, comments: commentsData } : post
          )
        );
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleModal = (postID) => {
    setOpenModal((prevID) => (prevID === postID ? null : postID));
  };

  const handleUpdatePost = (postID) => {
    setOpenUpdateModal(postID);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openModal && !event.target.closest(".modal-content")) {
        setOpenModal(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openModal]);

  return (
    <div
      className={`flex mb-4 ${
        isDarkMode ? "bg-gray-900 text-white border-t" : "bg-white text-black"
      } flex-col p-4 shadow-md gap-14`}
    >
      {posts.map((post) => (
        <div key={post._id} className="flex flex-col gap-3">
          <div className="flex gap-4 w-full justify-between">
            <div className="flex gap-2">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={
                  post.user?.profilePhoto ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Profile"
              />
              <div className="flex flex-col gap-1 ml-2">
                <Link href={`/profile/${post.user._id}`}>
                  <p className="font-medium cursor-pointer">
                    {post.user ? post.user.name : "Unknown User"}
                  </p>
                </Link>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="relative">
              {user && user._id === post.user._id && (
                <p
                  className="cursor-pointer mt-3 mr-1"
                  onClick={() => toggleModal(post._id)}
                >
                  <BsThreeDots />
                </p>
              )}
              {openModal === post._id && (
                <div className="absolute top-8 right-0 mb-4 p-2 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50 modal-content">
                  <button
                    onClick={() => handleUpdatePost(post._id)}
                    className="flex items-center p-2 text-blue-600 hover:bg-gray-100 w-full"
                  >
                    <RxUpdate className="mr-2" />
                    <span>Update Post</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center p-2 text-red-600 hover:bg-gray-100 w-full"
                  >
                    <MdDeleteOutline className="mr-2" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            {post.imgURL && (
              <img
                className="rounded-lg max-h-96 w-full object-cover cursor-pointer"
                src={post.imgURL}
                alt="Post"
              />
            )}
          </div>
          <div className="mt-3 gap-3 flex-col flex overflow-auto break-words w-[47rem]">
            <p className="font-semibold text-xl">{post.title} :</p>
            <p className="font-normal  break-words">{post.content}</p>
          </div>

          <div className="mt-8 flex justify-between w-full  pb-6 border-b-[2px]">
            <div className="flex w-full gap-7">
              <div
                className={`group flex items-center duration-150 w-32 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                  isDarkMode
                    ? likedPosts[post._id]
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-white"
                    : likedPosts[post._id]
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleLike(post._id)}
              >
                <AiOutlineLike
                  className={`text-lg duration-150 ${
                    likedPosts[post._id]
                      ? "text-white"
                      : "group-hover:text-blue-700"
                  }`}
                />
                <span className="text-xs font-medium">{post.likes} Likes</span>
              </div>

              <div
                className={`group flex items-center w-36 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"
                }`}
                onClick={() => handleViewComments(post._id)}
              >
                <FaRegComments className="text-lg group-hover:text-orange-300 duration-150" />
                <span className="text-xs font-medium">
                  {post.comments?.length || 0} Comments
                </span>
              </div>
              <div
                className={`flex group items-center w-28 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"
                }`}
              >
                <RiShareForwardLine className="text-lg group-hover:text-green-600 duration-150" />
                <span className="text-xs font-medium">Share</span>
              </div>
            </div>
          </div>

          {activeCommentsPostID === post._id && (
            <div className="mt-4 flex flex-col gap-3">
              <div
                className={`mb-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin ${
                  post.comments.length > 3 ? "max-h-40" : ""
                }`}
              >
                {post.comments &&
                  post.comments.map((comment, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                      <img
                        src={
                          comment.userProfilePhoto ||
                          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-medium">
                          {comment.userID.name}
                        </span>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <form
                onSubmit={(e) => handleSendComment(e, post._id)}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={comments[post._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                  placeholder="Write a comment..."
                  className={`w-full p-2 focus:outline-none rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                />

                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      ))}

      {openUpdateModal && (
        <UpdatePostModal
          post={posts.find((post) => post._id === openUpdateModal)}
          onClose={() => setOpenUpdateModal(null)}
          onUpdate={handleUpdatePost}
        />
      )}
    </div>
  );
};

export default Feed;

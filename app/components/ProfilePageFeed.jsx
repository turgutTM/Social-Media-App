"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdatePostModal from "../components/UpdatePostModal";
import { CiLock } from "react-icons/ci";
import { ClipLoader } from "react-spinners";

const ProfilePageFeed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [activeCommentsPostID, setActiveCommentsPostID] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(null);
  const [canViewProfile, setCanViewProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(null);

  const darkMode = useSelector((state) => state.user.darkMode);
  const loggedUser = useSelector((state) => state.user.user);
  const loggedUserId = loggedUser?._id;
  const isLoggedUser = loggedUserId === userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          if (
            isLoggedUser ||
            !userData.isPrivate ||
            (loggedUser.friends && loggedUser.friends.includes(userId))
          ) {
            setCanViewProfile(true);
          } else {
            setCanViewProfile(false);
          }
        } else {
          console.error("Failed to fetch user data");
          setCanViewProfile(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCanViewProfile(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/${userId}`);
        if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);

          const storedLikes =
            JSON.parse(localStorage.getItem("likedPosts")) || {};
          const userLikedPosts = {};
          postsData.forEach((post) => {
            userLikedPosts[post._id] = post.likedBy.includes(userId);
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

    if (userId) {
      fetchUser();
      if (canViewProfile) {
        fetchPosts();
      }
    }
  }, [userId, canViewProfile]);

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
                ? post.likedBy.filter((id) => id !== userId)
                : [...post.likedBy, userId],
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
        body: JSON.stringify({ userID: userId }),
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
          userID: userId,
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
  const toggleModal = (postID) => {
    setOpenModal((prevID) => (prevID === postID ? null : postID));
  };
  const handleUpdatePost = (postID) => {
    setOpenUpdateModal(postID);
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

  return (
    <div
      className={`flex flex-col rounded-md p-4 shadow-md gap-14 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      {!canViewProfile ? (
        <div className="w-full justify-center items-center flex flex-col gap-2">
          <CiLock className="text-5xl" />
          <p>This account is private, add friend to see their content</p>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={
                  user?.profilePhoto ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="User"
              />
              <div className="flex flex-col gap-1">
                <p className="font-medium">{user?.name || "Loading..."}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user && user._id === post.user._id && (
                <p
                  className="ml-auto cursor-pointer mt-3"
                  onClick={() => toggleModal(post._id)}
                >
                  <BsThreeDots />
                </p>
              )}
              {openModal === post._id && (
                <div className="absolute  right-0 mt-32 mr-6 p-2 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50 modal-content">
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
            <div>
              {post.imgURL && (
                <img
                  className="rounded-lg max-h-96 w-full object-cover cursor-pointer"
                  src={post.imgURL}
                  alt="Post"
                />
              )}
            </div>
            <div className="mt-3 gap-3 flex-col flex">
              <p className="font-semibold text-xl">{post.title} :</p>
              <p className="font-normal ">{post.content}</p>
            </div>
            <div className="mt-8 flex justify-between">
              <div className="flex w-full gap-7">
                <div
                  className={`group flex border border-white items-center duration-150 w-32 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                    darkMode
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
                  <span className="text-xs font-medium">
                    {post.likes} Likes
                  </span>
                </div>

                <div
                  className="group flex items-center w-36 gap-4 p-2 h-fit rounded-3xl cursor-pointer"
                  onClick={() => handleViewComments(post._id)}
                >
                  <FaRegComments className="text-lg group-hover:text-orange-300 duration-150" />
                  <span className="text-xs font-medium">
                    {post.comments.length} Comments
                  </span>
                </div>
                <div
                  className={`flex group items-center w-28 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border border-white text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <RiShareForwardLine className="text-lg group-hover:text-green-600 duration-150" />
                  <span className="text-xs font-medium">Share</span>
                </div>
              </div>
            </div>
            {activeCommentsPostID === post._id && (
              <div
                className={`mt-4 flex flex-col gap-4 ${
                  post.comments.length > 3
                    ? "max-h-48 overflow-y-auto scrollbar-thin"
                    : ""
                }`}
              >
                <form
                  className="flex gap-4"
                  onSubmit={(e) => handleSendComment(e, post._id)}
                >
                  <input
                    type="text"
                    value={comments[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    placeholder="Write a comment..."
                    className={`p-2 w-full rounded-md ${
                      darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
                    }`}
                  />
                  <button
                    type="submit"
                    className={`p-2 px-4 rounded-md ${
                      darkMode ? "bg-blue-500 text-white" : "bg-blue-100"
                    }`}
                  >
                    Post
                  </button>
                </form>
                {post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-center gap-4 border-gray-300 py-2"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={
                        comment.userID.profilePhoto ||
                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt="Commenter"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{comment.userID.name}</p>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
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

export default ProfilePageFeed;

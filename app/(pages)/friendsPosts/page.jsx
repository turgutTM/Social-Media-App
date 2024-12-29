"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComments } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";

const FriendsPosts = () => {
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [hoveredUser, setHoveredUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [comments, setComments] = useState({});
  const [activeCommentsPostID, setActiveCommentsPostID] = useState(null);
  const router = useRouter();
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

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

      if (!isLiked && user._id !== postUserID) {
        const notificationResponse = await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postID: postID,
            receiverId: postUserID,
            senderId: user._id,
            type: "like",
          }),
        });

        if (!notificationResponse.ok) {
          console.error("Failed to send notification");
        }
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
  const handleSendComment = async (e, postID, postUserID) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/share-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postID,
          userID: user._id,
          comment: commentText,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setComments((prevComments) => [...prevComments, result]);
        setCommentText("");
        toast.success("Comment added successfully!");

        if (user._id !== postUserID) {
          const notifyResponse = await fetch("/api/send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postID: postID,
              receiverId: postUserID,
              senderId: user._id,
              type: "comment",
            }),
          });

          if (!notifyResponse.ok) {
            console.error("Failed to send notification");
          }
        }
      } else {
        console.error("Failed to add comment");
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding comment.");
    }
  };

  const handleViewComments = async (postID) => {
    setIsLoadingComment(true);
    if (activeCommentsPostID === postID) {
      setActiveCommentsPostID(null);
      setIsLoadingComment(false);
    } else {
      setActiveCommentsPostID(postID);
      try {
        const response = await fetch(`/api/post-comments/${postID}`);
        if (response.ok) {
          const commentsData = await response.json();
          setComments(commentsData);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setIsLoadingComment(false);
    }
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
        You have no friend in your friends list or they have not been shared
        anything yet
      </p>
    );
  }

  return (
    <div
      className={`relative  flex flex-col w-full p-4 shadow-md gap-14 ${
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
          <div className="flex flex-col  items-center gap-4 border-b pb-4 mb-4">
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
              {post.imgURL && (
                <img
                  className="w-full h-auto rounded-lg mb-4 shadow-md"
                  src={post.imgURL}
                  alt="Post"
                />
              )}
            </div>
            <div className="mt-3 gap-3 flex-col flex overflow-auto break-words w-[47rem]">
              <p className="font-semibold text-xl">{post.title}</p>
              <p className="font-normal  break-words">{post.content}</p>
            </div>
            <div className="mt-8 flex justify-between w-full  pb-6 border-b-[2px]">
              <div className="flex w-full gap-7">
                <div
                  className={`group flex items-center duration-150 w-32 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                    isDarkMode
                      ? likedPosts[post._id]
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white"
                      : likedPosts[post._id]
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => handleLike(post._id,post.userID)}
                >
                  <AiOutlineLike
                    className={`text-lg duration-150 ${
                      likedPosts[post._id]
                        ? "text-white"
                        : "group-hover:text-blue-800"
                    }`}
                  />
                  <span className="text-xs font-medium">
                    {post.likes} Likes
                  </span>
                </div>

                <div
                  className={`group flex items-center w-36 gap-4 p-2 h-fit rounded-3xl cursor-pointer ${
                    isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => handleViewComments(post._id)}
                >
                  <FaRegComments className="text-lg group-hover:text-orange-300 duration-150" />
                  <span className="text-xs font-medium">
                    {post.commentCount || 0} Comments
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
                {isLoadingComment ? (
                  <div className="flex justify-center items-center h-[7rem]">
                    <ClipLoader
                      size={20}
                      color={"#123abc"}
                      isLoadingComment={isLoadingComment}
                    />
                  </div>
                ) : (
                  <div className="mb-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin max-h-60">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div>
                        <span className="font-medium flex gap-1 items-center">
                            <img
                              src={
                                comment?.user?.profilePhoto ||
                                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                              }
                              alt="Profile"
                              className="w-8 h-8 mr-1 rounded-full"
                            />
                            <Link href={`/profile/${comment.userID}`}>
                              {comment.user?.name}
                            </Link>
                            {post?.userID == comment?.userID && (
                              <span className="text-[10px] flex items-center mt-1 text-red-500">
                                • Author
                              </span>
                            )}
                            <p className="text-gray-400 ml-1 text-[10px]">
                              {formatDistanceToNow(
                                new Date(comment?.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                            {(post.userID === user?._id ||
                              comment.userID === user?._id) && (
                              <span
                                className="ml-1 flex items-center cursor-pointer hover:text-red-500 text-gray-400 text-sm duration-300"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <MdDeleteOutline />
                              </span>
                            )}
                          </span>

                          <p className="text-sm w-[30rem] ml-10 overflow-auto break-words">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => handleSendComment(e, post._id, post.userID)}
                  className="flex items-center gap-4"
                >
                  <img
                    src={
                      user.profilePhoto ||
                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className={`flex-1 p-2 focus:outline-none rounded-lg ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsPosts;

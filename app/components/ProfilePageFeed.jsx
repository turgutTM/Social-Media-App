  "use client";
  import React, { useEffect, useState } from "react";
  import { AiOutlineLike } from "react-icons/ai";
  import { FaRegComments } from "react-icons/fa";
  import { formatDistanceToNow } from "date-fns";
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
  import Skeleton from "./Skeleton";
  import Link from "next/link";

  const ProfilePageFeed = ({ userId }) => {
    const [blockStatus, setBlockStatus] = useState(null);
    const isDarkMode = useSelector((state) => state.user.darkMode);
    const [isLoadingComment, setIsLoadingComment] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [comments, setComments] = useState({});
    const [activeCommentsPostID, setActiveCommentsPostID] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(null);
    const [canViewProfile, setCanViewProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [openModal, setOpenModal] = useState(null);
    const darkMode = useSelector((state) => state.user.darkMode);
    const loggedUser = useSelector((state) => state.user.user);
    const loggedUserId = loggedUser?._id;
    const isLoggedUser = loggedUserId === userId;

    useEffect(() => {
      const fetchUserAndPosts = async () => {
        try {
          setIsLoading(true);

          const response = await fetch(`/api/user/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const userData = await response.json();
          setUser(userData);

          if (loggedUser?.blockedUsers?.includes(userId)) {
            setBlockStatus("iBlockedUser");
            setCanViewProfile(false);
          } else if (userData?.blockedUsers?.includes(loggedUserId)) {
            setBlockStatus("userBlockedMe");
            setCanViewProfile(false);
          } else if (
            isLoggedUser ||
            !userData.isPrivate ||
            (loggedUser.friends && loggedUser.friends.includes(userId))
          ) {
            setCanViewProfile(true);
          } else {
            setCanViewProfile(false);
          }

          if (
            !loggedUser?.blockedUsers?.includes(userId) &&
            !userData?.blockedUsers?.includes(loggedUserId) &&
            (isLoggedUser ||
              !userData.isPrivate ||
              (loggedUser.friends && loggedUser.friends.includes(userId)))
          ) {
            const postsRes = await fetch(`/api/posts/${userId}`);
            if (!postsRes.ok) throw new Error("Failed to fetch posts");
            const postsData = await postsRes.json();
            setPosts(postsData);

            const storedLikes =
              JSON.parse(localStorage.getItem("likedPosts")) || {};
            const userLikedPosts = {};
            postsData.forEach((post) => {
              userLikedPosts[post._id] = post.likedBy.includes(userId);
            });
            setLikedPosts(userLikedPosts);
            localStorage.setItem("likedPosts", JSON.stringify(userLikedPosts));
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      if (userId) {
        fetchUserAndPosts();
      }
    }, [userId]);

    const handleLike = async (postID, postUserID) => {
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

        if (!isLiked && loggedUserId !== postUserID) {
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

    const handleDeleteComment = async (commentId) => {
      try {
        const response = await fetch("/api/comment-delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        });

        if (response.ok) {
          setComments((prevComments) =>
            prevComments.filter((c) => c._id !== commentId)
          );
          toast.success("Comment deleted successfully");
        } else {
          throw new Error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
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
            userID: loggedUserId,
            comment: commentText,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setComments((prevComments) => [...prevComments, result]);
          setCommentText("");
          toast.success("Comment added successfully!");

          if (loggedUserId !== postUserID) {
            const notifyResponse = await fetch("/api/send-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                postID: postID,
                receiverId: postUserID,
                senderId: loggedUserId,
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
        className={`flex flex-col rounded-md p-4 shadow-md gap-14 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {isLoading ? (
          <div className="p-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} type="feed" />
            ))}
          </div>
        ) : blockStatus === "iBlockedUser" ? (
          <div className="w-full justify-center items-center flex flex-col gap-2">
            <CiLock className="text-5xl" />
            <p>You blocked this user</p>
          </div>
        ) : blockStatus === "userBlockedMe" ? (
          <div className="w-full justify-center items-center flex flex-col gap-2">
            <CiLock className="text-5xl" />
            <p>{user?.name || "User"} blocked you</p>
          </div>
        ) : !canViewProfile ? (
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
                    onClick={() => handleLike(post._id, post.userID)}
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
                    className={`group flex items-center w-36 gap-4 p-2 border  border-white h-fit rounded-3xl cursor-pointer ${
                      isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => handleViewComments(post._id)}
                  >
                    <FaRegComments className="text-lg  group-hover:text-orange-300 duration-150" />
                    <span className="text-xs font-medium">
                      {post.commentCount} Comments
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
                <div className="mt-4 flex flex-col gap-3">
                  {isLoadingComment ? (
                    <div className="flex flex-col items-start ">
                      {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} type="comment" />
                      ))}
                    </div>
                  ) : (
                    <div className="mb-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin max-h-60">
                      {comments.map((comment, index) => (
                        <div
                          key={index}
                          className="flex items-start  gap-2 mb-1"
                        >
                          <div>
                            <span className="font-medium flex gap-1 object-cover items-center">
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
                                <span className="text-[10px] flex items-center text-red-500">
                                  • Author
                                </span>
                              )}
                              <p className="text-gray-400 ml-1 flex items-center text-[10px]">
                                {formatDistanceToNow(
                                  new Date(comment?.createdAt),
                                  { addSuffix: true }
                                )}
                              </p>
                              {(post.userID === loggedUserId ||
                                comment.userID === loggedUserId) && (
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
                        loggedUser.profilePhoto ||
                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt="User Profile"
                      className="w-10 h-10 object-cover rounded-full"
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

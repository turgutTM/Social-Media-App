"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { FaRegFileVideo } from "react-icons/fa";
import { CgPoll } from "react-icons/cg";
import { MdEventNote } from "react-icons/md";
import { addPost } from "../features/PostsSlice";
import { createPost } from "../features/PostsAction";
import { UploadButton } from "../utils/uploadthing";

const AddPost = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const dispatch = useDispatch();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [imgURL, setImgURL] = useState("");

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handlePostSubmit = async () => {
    if (!postTitle || !postContent) {
      setError("Title and content are required");
      return;
    }

    if (!user._id) {
      console.error("User ID is missing");
      return;
    }

    const newPost = {
      userID: user._id,
      imgURL: imgURL || "",
      title: postTitle,
      content: postContent,
      likes: 0,
    };

    try {
      await createPost(newPost);
      dispatch(addPost(newPost));
      setPostContent("");
      setPostTitle("");
      setImgURL("");
      setShowModal(false);
      setError("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } rounded-md shadow-lg p-5 transition-colors duration-300`}
    >
      <div className="flex items-center gap-3">
        <img
          className="w-12 h-12 object-cover rounded-full"
          src={
            user.profilePhoto ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="User"
        />
        <textarea
          className={`${
            isDarkMode
              ? "bg-gray-700 placeholder:text-gray-300"
              : "bg-gray-100 placeholder:text-gray-500"
          } p-3 rounded-full w-full h-12 resize-none cursor-pointer duration-300`}
          placeholder="What's on your mind..."
          value={postContent}
          onClick={() => setShowModal(true)}
          readOnly
        ></textarea>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } relative z-60 rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh] transition-colors duration-300`}
          >
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Create Post
            </h2>
            {error && (
              <p className="text-red-500 mb-4 bg-red-50 dark:bg-red-900 p-2 rounded-md">
                {error}
              </p>
            )}
            <input
              maxLength="50"
              className={`${
                isDarkMode
                  ? "bg-gray-700 placeholder:text-gray-300 text-white"
                  : "bg-gray-100 placeholder:text-gray-500 text-black"
              } p-3 border border-transparent rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full mb-4 transition-colors duration-300`}
              placeholder="Title (up to 50 characters)"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              maxLength="500"
              className={`${
                isDarkMode
                  ? "bg-gray-700 placeholder:text-gray-300 text-white"
                  : "bg-gray-100 placeholder:text-gray-500 text-black"
              } p-3 border border-transparent rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full h-64 mb-4 resize-none transition-colors duration-300`}
              placeholder="What's on your mind..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-300">
                <UploadButton
                  endpoint="imageUploader"
                  className="my-custom-upload-button"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setImgURL(res[0].url);
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <MdOutlineInsertPhoto className="text-blue-500" />
                    <p>Photo</p>
                  </div>
                </UploadButton>
              </div>
              <div className="flex items-center gap-2 cursor-not-allowed opacity-50 p-2 rounded-md">
                <FaRegFileVideo className="text-green-500" />
                <p>Video</p>
              </div>
              <div className="flex items-center gap-2 cursor-not-allowed opacity-50 p-2 rounded-md">
                <CgPoll className="text-orange-500" />
                <p>Poll</p>
              </div>
              <div className="flex items-center gap-2 cursor-not-allowed opacity-50 p-2 rounded-md">
                <MdEventNote className="text-purple-500" />
                <p>Event</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-md text-white font-medium transition-colors duration-300"
                onClick={handlePostSubmit}
              >
                Share
              </button>
              <button
                className={`${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-300 hover:bg-gray-200 text-black"
                } px-5 py-2 rounded-md font-medium transition-colors duration-300`}
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;

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
      className={` ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-md shadow-lg`}
    >
      <div className="flex p-5 items-center gap-3">
        <img
          className="w-16 h-16 object-cover rounded-full"
          src={
            user.profilePhoto ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="User"
        />
        <textarea
          className={`${
            isDarkMode ? "bg-gray-800 placeholder:text-white" : "bg-gray-100"
          } p-2 border rounded-md focus:border-transparent focus:ring-0 outline-none w-full h-20`}
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
              isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } h-5/6 rounded-md shadow-lg p-7 w-2/3 relative z-60 overflow-y-auto`}
          >
            <h2 className="text-xl mb-4">Create Post</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              maxLength="50"
              className={`${
                isDarkMode
                  ? "bg-gray-700 placeholder:text-white"
                  : "bg-gray-100"
              } p-2 border rounded-md focus:border-transparent focus:ring-0 outline-none w-full mb-4`}
              placeholder="Title ( 50 characters )"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              maxLength="500"
              className={`${
                isDarkMode
                  ? "bg-gray-700 placeholder:text-white"
                  : "bg-gray-100"
              } p-2 border rounded-md focus:border-transparent focus:ring-0 outline-none w-full h-3/5 mb-4`}
              placeholder="What's on your mind"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1">
                <UploadButton
                  endpoint="imageUploader"
                  
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setImgURL(res[0].url);
                    }
                  }}
                >
                  <MdOutlineInsertPhoto /> <p>Photo</p>
                </UploadButton>
              </div>
              <div className="flex items-center gap-1">
                <FaRegFileVideo />
                <p>Video</p>
              </div>
              <div className="flex items-center gap-1">
                <CgPoll />
                <p>Poll</p>
              </div>
              <div className="flex items-center gap-1">
                <MdEventNote />
                <p>Event</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-500 w-24 duration-300 p-2 rounded-md text-white"
                onClick={handlePostSubmit}
              >
                Share
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-500 w-24 duration-300 p-2 rounded-md text-white"
                onClick={() => setShowModal(false)}
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

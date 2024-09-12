import React, { useState } from "react";

const UpdatePostModal = ({ post, onClose, onUpdate }) => {
  const [newContent, setNewContent] = useState(post.content);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/update-post/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
        onClose();
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[35rem]">
        <h2 className="text-xl font-semibold mb-4">Update Post</h2>
        <textarea
          maxLength="500"
          value={newContent}
          placeholder="Update the content ( 500 characters )"
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-2 border border-gray-300 focus:outline-none rounded-md"
          rows="4"
        />
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-600  hover:text-red-400  duration-200">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className=" font-medium duration-150 text-black hover:text-[#5c5c5c] rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostModal;

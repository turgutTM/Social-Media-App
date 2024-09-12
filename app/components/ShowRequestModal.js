import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const ShowRequestModal = ({ isOpen, closeModal, followRequests, handleFollowRequest, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className={`w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-semibold mb-4">All Friend Requests</h2>
        {followRequests.length > 0 ? (
          followRequests.map((request) => (
            <div key={request._id} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={
                    request.profilePhoto ||
                    "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  }
                  alt={`${request.name}'s profile`}
                />
                <p className="font-semibold">{request.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-xl  hover:text-green-700 duration-200"
                  onClick={() => handleFollowRequest(request._id, "accept")}
                >
                  <IoMdCheckmark />
                </button>
                <button
                  className="text-xl  hover:text-red-700 duration-200"
                  onClick={() => handleFollowRequest(request._id, "reject")}
                >
                  <IoCloseSharp />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No follow requests available.</p>
        )}
        <button
          className="mt-4  text-black hover:text-red-500 duration-200 "
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowRequestModal;

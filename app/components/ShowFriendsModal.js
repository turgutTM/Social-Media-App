import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiCalendar } from "react-icons/ci";
import { useSelector } from "react-redux";

const ShowFriendsModal = ({ closeFriends, userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`/api/all-friends/${userId}`);
        if (response.status === 200) {
          setFriends(response.data.friends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <div className="fixed inset-0 overflow-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-6 rounded-lg shadow-lg w-1/2 max-w-lg`}
      >
        <h2 className="text-2xl font-semibold mb-4">Friends List</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading...</p>
          </div>
        ) : friends.length === 0 ? (
          <p>No friends found.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {" "}
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className={`flex items-center gap-4 border-b pb-2 ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <img
                    className="w-12 h-12 rounded-full"
                    src={
                      friend.profilePhoto ||
                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    alt={friend.name}
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{friend.name}</p>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {friend.bio}
                    </p>
                    <div
                      className={`flex gap-2 items-center text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <CiCalendar />
                        <span>
                          Joined{" "}
                          {new Date(friend.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={closeFriends}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? "bg-gray-600 text-gray-300"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowFriendsModal;

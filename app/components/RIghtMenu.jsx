"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import { CiGift } from "react-icons/ci";
import Link from "next/link";
import ShowRequestModal from "./showRequestModal";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../features/UserSlice";
import ChatModal from "./ChatModal";

const RightMenu = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const user = useSelector((state) => state.user.user);
  const [followRequests, setFollowRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [chatOpen, setChatOpen] = useState();
  const [selectedFriend, setSelectedFriend] = useState();
  const [initialMessage, setInitialMessage] = useState();
  console.log(friends);

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const response = await axios.get(`/api/all-friend-request/${user._id}`);
        setFollowRequests(response.data.friendRequests);
      } catch (error) {
        setError("Failed to fetch follow requests.");
      }
    };

    if (user._id) {
      fetchFollowRequests();
    }
  }, [user]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`/api/all-friends/${user._id}`);
        if (response.status === 200) {
          setFriends(response.data.friends);
          console.log(response.data.friends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (user._id) {
      fetchFriends();
    }
  }, [user]);

  const handleFollowRequest = async (friendId, action) => {
    try {
      const response = await axios.post(`/api/${action}-friend-request`, {
        userId: user._id,
        friendId,
      });

      if (response.status === 200) {
        setFollowRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendId)
        );
        if (action === "accept") {
          dispatch(acceptFriendRequest({ friendId }));
        } else {
          dispatch(rejectFriendRequest({ friendId }));
        }
      } else {
        setError(`Failed to ${action} follow request.`);
      }
    } catch (error) {
      setError(`Failed to ${action} follow request.`);
    }
  };

  const today = new Date();
  const friendsWithBirthdayToday = friends.filter((friend) => {
    const friendBirthday = new Date(friend.birthday);
    return (
      friendBirthday.getDate() === today.getDate() &&
      friendBirthday.getMonth() === today.getMonth()
    );
  });

  const handleCelebrate = (friend) => {
    setChatOpen(true);
    setSelectedFriend(friend);
    setInitialMessage("Happy Birthday! Wish you all the best 🎉");
  };

  return (
    <div
      className={`flex flex-col max-xl:hidden gap-4 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      <div
        className={`w-5/6 p-4 flex flex-col gap-4 shadow-md rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between">
          <p
            className={`font-semibold ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Follow Requests
          </p>
          {followRequests.length > 3 && (
            <button
              className="text-blue-700"
              onClick={() => setIsModalOpen(true)}
            >
              See all
            </button>
          )}
        </div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          followRequests.slice(0, 3).map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={request.profilePhoto || "/defaultpicture.jpg"}
                  alt={`${request.name}'s profile`}
                />
                <Link href={`/profile/${request._id}`}>
                  <p className="font-semibold">{request.name}</p>
                </Link>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[13px] bg-blue-500 hover:bg-blue-400 duration-200 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleFollowRequest(request._id, "accept")}
                >
                  <p>Confirm</p>
                </button>
                <button
                  className="text-[13px] bg-gray-300 hover:bg-gray-200 duration-200 py-1 px-3 rounded-lg"
                  onClick={() => handleFollowRequest(request._id, "reject")}
                >
                  <p>Delete</p>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ShowRequestModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        followRequests={followRequests}
        handleFollowRequest={handleFollowRequest}
        isDarkMode={isDarkMode}
      />

      <div
        className={`w-5/6 p-4 flex flex-col gap-4 shadow-md rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between">
          <p
            className={`font-semibold ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Birthdays
          </p>
        </div>
        {friendsWithBirthdayToday.length > 0 ? (
          friendsWithBirthdayToday.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  className="w-11 h-11 rounded-full object-cover"
                  src={friend.profilePhoto || "/defaultpicture.jpg"}
                  alt={`${friend.name}'s profile`}
                />
                <p className="font-semibold">{friend.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCelebrate(friend)}
                  className="text-sm bg-blue-600 text-white rounded-lg pl-2 pr-2 pt-1 pb-1"
                >
                  Celebrate
                </button>
              </div>
            </div>
          ))
        ) : (
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            There is no one whose birthday is today
          </p>
        )}

        <div
          className={`flex items-center gap-3 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } p-2 rounded-lg pl-3 pt-3 pb-3 shadow-md`}
        >
          <div>
            <CiGift className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-sm">Upcoming Birthdays</p>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No upcoming birthdays
            </p>
          </div>
        </div>
      </div>
      <ChatModal
        chatOpen={chatOpen}
        selectedFriend={selectedFriend}
        initialMessage={initialMessage}
        handleToggleChat={() => setChatOpen(false)}
      />
    </div>
  );
};

export default RightMenu;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineSchool } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { CiLink, CiCalendar } from "react-icons/ci";
import Link from "next/link";
import UpdateUserModal from "../components/UpdateUserModal";

import "react-toastify/dist/ReactToastify.css";

import {
  addBlockedUser,
  addFriendRequest,
  removeFriend,
  addFollowing,
  removeFollowing,
  toggleIsPrivate,
  removeBlockedUser,
} from "../features/UserSlice";
import { LiaUserFriendsSolid } from "react-icons/lia";
import ShowFriendsModal from "../components/ShowFriendsModal";
import Skeleton from "./Skeleton";

const ProfilePageRight = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const isPrivate = useSelector((state) => state.user.isPrivate);
  const [isLoading, setIsLoading] = useState(true);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [otherBlockedMe, setOtherBlockedMe] = useState(false);

  const loggedUserId = loggedUser?._id;
  const isLoggedUser = loggedUserId === userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUserData(user);

          setIsFriend(loggedUser.friends.includes(userId));

          setIsBlocked(loggedUser.blockedUsers.includes(userId));

          setIsFollowing(loggedUser.following.includes(userId));

          if (user.blockedUsers.includes(loggedUserId)) {
            setOtherBlockedMe(true);
          } else {
            setOtherBlockedMe(false);
          }
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, loggedUser.friends, loggedUser.blockedUsers, loggedUser.follows]);

  const sendFriendRequest = async () => {
    setRequestSent(true);
    try {
      const response = await fetch("/api/send-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedUserId, friendId: userId }),
      });

      if (response.ok) {
        dispatch(addFriendRequest(userId));
      } else {
        const error = await response.json();
        console.error("Error sending friend request:", error.message);
        setRequestSent(false);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setRequestSent(false);
    }
  };

  const removeFriendFromList = async () => {
    setRequestSent(true);
    try {
      const response = await fetch("/api/remove-friend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedUserId, friendId: userId }),
      });

      if (response.ok) {
        setIsFriend(false);
        setRequestSent(false);
        dispatch(removeFriend(userId));
      } else {
        const error = await response.json();
        console.error("Error removing friend:", error.message);
        setRequestSent(false);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setRequestSent(false);
    }
  };

  const handleFollowClick = async () => {
    try {
      if (isFollowing) {
        const response = await fetch("/api/follow", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedUserId, followId: userId }),
        });

        if (response.ok) {
          setIsFollowing(false);
          dispatch(removeFollowing(userId));
        } else {
          const error = await response.json();
          console.error("Error unfollowing user:", error.message);
        }
      } else {
        const response = await fetch("/api/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedUserId, followId: userId }),
        });

        if (response.ok) {
          setIsFollowing(true);
          dispatch(addFollowing(userId));
        } else {
          const error = await response.json();
          console.error("Error following user:", error.message);
        }
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  const blockUser = async () => {
    try {
      const response = await fetch("/api/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedUserId, blockUserId: userId }),
      });

      if (response.ok) {
        setIsBlocked(true);
        dispatch(addBlockedUser(userId));
        console.log("User blocked successfully");

        if (isFriend) {
          removeFriendFromList();
          dispatch(removeFriend(userId));
        }
        if (isFollowing) {
          handleFollowClick();
          dispatch(removeFollowing(userId));
        }
      } else {
        const error = await response.json();
        console.error("Error blocking user:", error.message);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const unBlockUser = async () => {
    try {
      const response = await fetch("/api/remove-from-block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedUserId, unblockUserId: userId }),
      });

      if (response.ok) {
        setIsBlocked(false);
        dispatch(removeBlockedUser(userId));
        console.log("User unblocked successfully");
      } else {
        const error = await response.json();
        console.error("Error unblocking user:", error.message);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const handlePrivateToggle = async () => {
    const newIsPrivateState = !isPrivate;
    try {
      const response = await fetch("/api/isprivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedUserId,
          isPrivate: newIsPrivateState,
        }),
      });

      if (response.ok) {
        dispatch(toggleIsPrivate());
        setUserData((prevData) => ({
          ...prevData,
          isPrivate: newIsPrivateState,
        }));
        console.log("Privacy setting updated successfully");
      } else {
        const error = await response.json();
        console.error("Error updating privacy setting:", error.message);
      }
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openFriends = () => setIsFriendsModalOpen(true);
  const closeFriends = () => setIsFriendsModalOpen(false);

  return (
    <>
      <div
        className={`flex flex-col w-5/6 p-5 gap-4 mb-5 shadow-md rounded-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {isLoading ? (
          <div className="p-4">
            {[...Array(1)].map((_, index) => (
              <Skeleton key={index} type="profiledetail" />
            ))}
          </div>
        ) : isBlocked ? (
          <div className="text-center flex flex-col text-red-500">
            <p>You blocked this user</p>
            <button
              onClick={() => unBlockUser()}
              className="text-blue-500 hover:underline"
            >
              Unblock
            </button>
          </div>
        ) : otherBlockedMe ? (
          <div className="text-center flex flex-col text-red-500">
            <p>{userData?.name || "User"} blocked you</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                User Information
              </p>
              {isLoggedUser && (
                <button
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-blue-800"
                  }`}
                  onClick={openModal}
                >
                  Update
                </button>
              )}
              {!isLoggedUser && (
                <button
                  className={`${
                    isFollowing
                      ? "bg-red-600 hover:bg-red-400 duration-150 text-white"
                      : "bg-blue-600 hover:bg-blue-400 duration-150 text-white"
                  } p-1 pl-4 pr-4 rounded-full`}
                  onClick={handleFollowClick}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xl">{userData.name}</p>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {userData.email}
              </p>
            </div>
            <div>
              <p>{userData?.bio?.substring(0, 30) || "This is my bio"}...</p>
            </div>
            <div className="flex gap-2 items-center">
              <IoLocationOutline />
              <p>
                Living in{" "}
                <span className="font-semibold">
                  {userData?.live?.substring(0, 30) || "World"}...
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlineSchool />
              <p>
                Went to{" "}
                <span className="font-semibold">
                  {userData?.school?.substring(0, 30) || "World"}...
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <IoBagOutline />
              <p>
                Works at{" "}
                <span className="font-semibold">
                  {userData?.worksAt?.substring(0, 30) || "World"} ...
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <CiCalendar />
              <p>
                Birthday:{" "}
                <span className="font-semibold">
                  {userData.birthday
                    ? new Date(userData.birthday).toLocaleDateString("en-US")
                    : "undefined"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LiaUserFriendsSolid className="text-green-700" />
              <div className="flex gap-1 items-center">
                <p>{userData.friends.length}</p>
                <button
                  onClick={openFriends}
                  className={isDarkMode ? "text-blue-400" : "text-blue-700"}
                >
                  friends
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <CiLink />
                <Link
                  target="_blank"
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                  href={userData.link || "#"}
                >
                  {userData.link || "No link provided"}
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <CiCalendar />
                <p>Joined {new Date(userData.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {isLoggedUser && (
              <div className="flex items-center justify-between">
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  Private Account{" "}
                  <span className="text-xs">
                    {isPrivate
                      ? "(nobody will see your account except your friends)"
                      : "(everybody can see your profile)"}
                  </span>
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={handlePrivateToggle}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 transition-colors duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            )}

            {!isLoggedUser && (
              <>
                <div className="flex justify-center">
                  {!isFriend ? (
                    userData.friendRequests &&
                    userData.friendRequests.includes(loggedUserId) ? (
                      <button
                        className="p-2 w-full rounded-md bg-gray-500 text-white"
                        disabled
                      >
                        Request Sent
                      </button>
                    ) : (
                      <button
                        className={`p-2 w-full rounded-md ${
                          requestSent
                            ? "bg-gray-500  text-white"
                            : "bg-blue-600 hover:bg-blue-500 duration-200 text-white"
                        }`}
                        onClick={sendFriendRequest}
                        disabled={requestSent}
                      >
                        {requestSent ? "Request Sent" : "Add Friend"}
                      </button>
                    )
                  ) : (
                    <button
                      className={`p-2 w-full rounded-md ${
                        requestSent
                          ? "bg-gray-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      onClick={removeFriendFromList}
                      disabled={requestSent}
                    >
                      {requestSent ? "Removing..." : "Remove Friend"}
                    </button>
                  )}
                </div>

                <div className="flex justify-center ">
                  <button
                    className="text-red-500 font-semibold w-full flex justify-end"
                    onClick={() => setIsBlockModalOpen(true)}
                    disabled={isBlocked}
                  >
                    {isBlocked ? "User Blocked" : "Block User"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {isBlockModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div
            className={`relative p-6 rounded-lg shadow-md ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Block User</h2>
            <p className="mb-6">
              Are you sure you want to block this user? You will no longer see
              their posts.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  blockUser();
                  setIsBlockModalOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
              >
                Block
              </button>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 duration-200 px-4 py-2 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <UpdateUserModal closeModal={closeModal} userData={userData} />
      )}
      {isFriendsModalOpen && (
        <ShowFriendsModal
          closeFriends={closeFriends}
          userId={userData._id}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default ProfilePageRight;

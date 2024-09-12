import React, { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineSchool } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { CiLink, CiCalendar } from "react-icons/ci";
import Link from "next/link";
import UpdateUserModal from "../components/UpdateUserModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import {
  addBlockedUser,
  addFriendRequest,
  removeFriend,
  addFollowing,
  removeFollowing,
  toggleIsPrivate,
} from "../features/UserSlice";
import { LiaUserFriendsSolid } from "react-icons/lia";
import ShowFriendsModal from "../components/ShowFriendsModal";

const ProfilePageRight = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const isPrivate = useSelector((state) => state.user.isPrivate);

  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.user.darkMode);

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
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
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
      } else {
        const error = await response.json();
        console.error("Error blocking user:", error.message);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <div
        className={`flex flex-col w-5/6 p-5 gap-4 mb-5 shadow-md rounded-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {isBlocked ? (
          <div className="text-center text-red-500">You blocked this user</div>
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
              <p>{userData.bio || "This is my bio"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <IoLocationOutline />
              <p>
                Living in{" "}
                <span className="font-semibold">
                  {userData.live || "World"}
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlineSchool />
              <p>
                Went to{" "}
                <span className="font-semibold">
                  {userData.school || "World"}
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <IoBagOutline />
              <p>
                Works at{" "}
                <span className="font-semibold">
                  {userData.worksAt || "World"}
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
                <span>Private Account</span>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={handlePrivateToggle}
                  className="w-3 h-3 text-blue-600 bg-gray-200 rounded focus:ring-blue-500"
                />
              </div>
            )}
            {!isLoggedUser && (
              <>
                <div className="flex justify-center">
                  {isFriend ? (
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
                  ) : (
                    <button
                      className={`p-2 w-full rounded-md ${
                        requestSent
                          ? "bg-gray-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                      onClick={sendFriendRequest}
                      disabled={requestSent}
                    >
                      {requestSent ? "Request Sent" : "Add Friend"}
                    </button>
                  )}
                </div>

                <div className="flex justify-center ">
                  <button
                    className=" text-red-500 font-semibold w-full flex justify-end"
                    onClick={blockUser}
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
      {isModalOpen && (
        <UpdateUserModal closeModal={closeModal} userData={userData} />
      )}
      {isFriendsModalOpen && (
        <ShowFriendsModal
          closeFriends={closeFriends}
          userId={userId}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default ProfilePageRight;

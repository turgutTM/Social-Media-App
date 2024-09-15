import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CiCirclePlus, CiSearch, CiChat1 } from "react-icons/ci";
import { MdOutlineNightlight } from "react-icons/md";
import { GoSun } from "react-icons/go";
import { LuUser2 } from "react-icons/lu";
import { RiNotification2Line, RiMore2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import {
  logoutUser,
  setDarkMode,
  setUser,
  toggleDarkMode,
} from "../features/userSlice";
import axios from "axios";

import ChatModal from "./ChatModal";
const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState(false);
  const [dropdownNotification, setDropdownNotification] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [followRequests, setFollowRequests] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/all-users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const response = await axios.get(`/api/all-friend-request/${user._id}`);
        setFollowRequests(response.data.friendRequests);
      } catch (error) {
        console.error("Failed to fetch follow requests:", error);
      }
    };

    if (user._id) {
      fetchFollowRequests();
    }
  }, [user]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(`/api/all-liked-users/${user._id}`);
        if (response.status === 200) {
          setLikedPosts(response.data.users);
        } else {
          console.error("Failed to fetch liked posts");
        }
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    if (user._id) {
      fetchLikedPosts();
    }
  }, [user]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/all-friend-request/${user._id}`);
        setFriendRequests(response.data.friendRequests);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      }
    };

    if (user._id) {
      fetchFriendRequests();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setDropdownNotification(false);
        setDropdownSearch(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        dispatch(logoutUser());
        router.push("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDropNotification = () => {
    setDropdownNotification((prev) => !prev);
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    setDropdownSearch(value.length > 0);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    return (
      fullName.includes(searchInput) ||
      user.name.toLowerCase().startsWith(searchInput) ||
      user.surname.toLowerCase().startsWith(searchInput)
    );
  });

  const handleToggleDarkMode = async () => {
    dispatch(toggleDarkMode());
    try {
      const response = await axios.post("/api/isdark", {
        userId: user._id,
        isDark: !isDarkMode,
      });

      if (response.status === 200) {
        console.log("Dark mode updated successfully in the database.");
      } else {
        console.error("Failed to update dark mode in the database.");
      }
    } catch (error) {
      console.error("Error toggling dark mode:", error);
    }
  };

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const totalNotifications = likedPosts.length + friendRequests.length;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 flex items-center p-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex ml-48 text-3xl font-bold text-blue-500">
        <Link href="/">TUGU</Link>
      </div>
      <div className="flex gap-6 ml-32">
        <Link href="/">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <AiOutlineHome />
            <p>Homepage</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <Link
            className="flex items-center gap-1.5 cursor-pointer"
            href="/friendsPosts"
          >
            <LiaUserFriendsSolid />
            <p>Friends</p>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <CiCirclePlus />
          <p>Stories</p>
        </div>
      </div>
      <div
        className="relative flex items-center border border-gray-300 rounded-full p-1 ml-36"
        ref={searchRef}
      >
        <input
          className={`border-none ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          } outline-none px-4 py-1 rounded-full`}
          placeholder="search..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        {dropdownSearch && (
          <div
            className={`absolute z-10 top-full left-0 mt-2 w-96 transition-all duration-200 ease-out ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } border rounded-lg shadow-lg overflow-hidden`}
            style={{
              maxHeight:
                filteredUsers.length > 0
                  ? `${Math.min(filteredUsers.length, 3) * 56}px`
                  : "0",
              opacity: filteredUsers.length > 0 ? 1 : 0,
            }}
          >
            <div className="flex flex-col gap-2 w-full">
              {filteredUsers.slice(0, 3).map((user) => (
                <Link key={user._id} href={`/profile/${user._id}`}>
                  <div
                    className={`flex items-center justify-between w-full px-4 py-2 cursor-pointer duration-200 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setDropdownSearch(false)}
                  >
                    <CiSearch
                      className={`${
                        isDarkMode ? "text-white " : "text-gray-700"
                      } mr-2`}
                    />
                    <div className="flex flex-grow items-center gap-1 ml-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="font-medium">{user.surname}</p>
                      <p>•</p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white" : "text-gray-700"
                        } `}
                      >
                        {user.wentTo}
                      </p>
                    </div>
                    <img
                      className="object-cover w-9 h-9 rounded-full"
                      src={
                        user.profilePhoto ||
                        "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      }
                      alt={user.name}
                    />
                  </div>
                </Link>
              ))}
              {filteredUsers.length > 3 && (
                <div className="px-4 py-2 text-center text-sm text-gray-500">
                  {`+${filteredUsers.length - 3} more users`}
                </div>
              )}
            </div>
          </div>
        )}

        <CiSearch className="text-gray-500 mr-2" />
      </div>
      <div className="flex ml-32 gap-7 items-center relative">
        <IoChatboxOutline
          onClick={handleToggleChat}
          className="cursor-pointer"
        />
        <div>
          <RiNotification2Line
            onClick={toggleDropNotification}
            className="cursor-pointer flex"
          />
          {totalNotifications > 0 && (
            <span
              className={`absolute top-2 ml-2 right-42  w-2 h-2 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center`}
            >
              
            </span>
          )}
        </div>

        {dropdownNotification && (
          <div
            ref={dropdownRef}
            className={`absolute right-8 top-5 z-10 mr-32 mt-2 w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } border rounded-lg shadow-lg`}
          >
            <div className="p-4 gap-4 flex flex-col max-h-64 overflow-y-auto scrollbar-thin">
              {likedPosts.length > 0 ? (
                likedPosts.map((likedPost) => (
                  <div key={likedPost._id}>
                    <div
                      className={`flex  ${
                        isDarkMode ? "border-gray-600" : "border-b-2"
                      } duration-200 rounded-lg p-2 items-center gap-3`}
                    >
                      <img
                        className="w-11 h-11 object-cover rounded-full"
                        src={
                          likedPost.profilePhoto ||
                          "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        }
                        alt={likedPost.name}
                      />
                      <div className="flex flex-col">
                        <p>
                          <Link href={`/profile/${likedPost._id}`}>
                            <span className="font-medium">
                              {likedPost.name}
                            </span>{" "}
                          </Link>
                          liked your post
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p></p>
              )}
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <Link key={request._id} href={`/profile/${request._id}`}>
                    <div
                      className={`flex cursor-pointer ${
                        isDarkMode ? "border-gray-600" : "border-b-2"
                      } duration-200 rounded-lg p-2 items-center gap-3`}
                    >
                      <img
                        className="w-11 h-11 object-cover rounded-full"
                        src={
                          request.profilePhoto ||
                          "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        }
                        alt={request.name}
                      />
                      <div className="flex flex-col">
                        <p>
                          <span className="font-medium">{request.name}</span>{" "}
                          sent you a friend request
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="w-full flex justify-center">
                  No more new notifications
                </p>
              )}
            </div>
          </div>
        )}

        <Link href={`/profile/${user?._id}`}>
          <LuUser2 />
        </Link>
        <div className="flex border-gray-200">
          <div
            className={`flex items-center cursor-pointer p-2 rounded-full ${
              isDarkMode
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={handleToggleDarkMode}
          >
            {isDarkMode ? (
              <GoSun className="text-lg" />
            ) : (
              <MdOutlineNightlight className="text-lg" />
            )}
          </div>
        </div>

        {user && Object.keys(user).length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <RiMore2Fill
              className="cursor-pointer mr-2"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div
                className={`absolute  right-0 z-10 mt-2 w-64 ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white"
                } border rounded-lg shadow-lg`}
              >
                <div
                  className="p-2 cursor-pointer text-red-400 ml-2 "
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {chatOpen && (
        <ChatModal chatOpen={chatOpen} handleToggleChat={handleToggleChat} />
      )}
    </div>
  );
};

export default Navbar;

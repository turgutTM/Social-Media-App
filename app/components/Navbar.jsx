import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { BsChatDots } from "react-icons/bs";

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
  const [notifications, setNotifications] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const [likedPosts, setLikedPosts] = useState([]);
  console.log(notifications);

  const [currentPath, setCurrentPath] = useState("/");

  const dropdownRef = useRef(null);
  const chatRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  console.log(likedPosts);

  const togglePath = (path) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDarkModeEnabled = JSON.parse(savedDarkMode);
      dispatch(setDarkMode(isDarkModeEnabled));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/get-notification/${user._id}`);
        if (response.ok) {
          const notifications = await response.json();
          setNotifications(notifications);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user && user._id) {
      fetchNotifications();
    }
  }, [user._id]);

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
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setDropdownNotification(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const toggleDropNotification = async (e) => {
    e.stopPropagation();
    togglePath("/notification");
    setDropdownNotification((prev) => !prev);

    try {
      const response = await fetch(`/api/toggle-read/${user._id}`, {
        method: "PUT",
      });

      if (response.ok) {
        console.log("Notifications marked as read");
      } else {
        console.error("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
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

  const handleToggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    dispatch(toggleDarkMode(newDarkModeState));

    localStorage.setItem("darkMode", JSON.stringify(newDarkModeState));

    try {
      const response = axios.post("/api/isdark", {
        userId: user._id,
        isDark: newDarkModeState,
      });

      response.then((res) => {
        if (res.status === 200) {
          console.log("Dark mode updated successfully in the database.");
        } else {
          console.error("Failed to update dark mode in the database.");
        }
      });
    } catch (error) {
      console.error("Error toggling dark mode:", error);
    }
  };

  const handleToggleChat = () => {
    togglePath("/chat");
    setChatOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-0 left-0 max-xl:flex-col max-lg: max-xl:gap-3 right-0 z-40 flex items-center p-2 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex ml-48  text-3xl font-bold text-blue-500">
        <Link onClick={() => togglePath("/")} href="/">
          <img className="w-14 max-lg:w-4" src="/imageTugu.png"></img>
        </Link>
      </div>
      <div className="flex gap-6 ml-32">
        <div
          onClick={() => togglePath("/")}
          className="relative flex items-center gap-1.5 cursor-pointer"
        >
          <Link href="/">
            <p className={`${currentPath === "/" ? "text-blue-500" : ""}`}>
              Homepage
            </p>
          </Link>
          {currentPath === "/" && (
            <span className="absolute bottom-0 left-0 w-full h-1"></span>
          )}
        </div>

        <div
          onClick={() => togglePath("/friendsPosts")}
          className="relative flex items-center gap-1.5 cursor-pointer"
        >
          <Link href="/friendsPosts">
            <p
              className={`${
                currentPath === "/friendsPosts" ? "text-blue-500" : ""
              }`}
            >
              Friends
            </p>
          </Link>
          {currentPath === "/friendsPosts" && (
            <span className="absolute bottom-0 left-0 w-full h-1 "></span>
          )}
        </div>

        <div
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          className="relative flex items-center gap-1.5 cursor-pointer "
        >
          <p>Stories</p>

          {isTooltipVisible && (
            <div
              className={`absolute top-full mt-2 w-36 left-1/2 transform -translate-x-1/2 p-2 text-sm rounded-lg shadow-md ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
              }`}
            >
              Not available yet
            </div>
          )}
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
                      src={user.profilePhoto || "defaultpicture.jpg"}
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
      <div ref={chatRef} className="flex  ml-32 gap-7 items-center relative">
        <BsChatDots
          onClick={handleToggleChat}
          className={`cursor-pointer flex ${
            currentPath === "/chat" ? "text-blue-500" : ""
          }`}
        />
        <div>
          <RiNotification2Line
            onClick={(e) => {
              toggleDropNotification(e);
            }}
            className={`cursor-pointer flex ${
              currentPath === "/notification" ? "text-blue-500" : ""
            }`}
          />

          {Array.isArray(notifications) &&
            notifications.some((notification) => !notification.read) && (
              <span className="absolute bottom-4 ml-2 right-42 w-2 h-2 text-xs font-bold text-white bg-red-600 p-2 rounded-full flex items-center justify-center">
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </span>
            )}
        </div>

        {dropdownNotification && (
          <div
            ref={notificationRef}
            className={`absolute right-0 top-full z-50 mt-2 w-80 shadow-lg rounded-lg p-2 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            } h-fit max-h-60 overflow-y-auto scrollbar-hide`}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-2 rounded-lg cursor-pointer duration-200 flex gap-2 items-center ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={notification.senderPhoto || "defaultpicture.jpg"}
                    alt="Notification Sender"
                  />
                  <span className="text-sm">
                    <span className="font-semibold">
                      {notification.senderName}
                    </span>
                    <span className="font-thin ml-1">
                      {notification.messageBody}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className={`${isDarkMode ? "text-gray-400" : "text-black"}`}>
                  No notifications yet
                </p>
              </div>
            )}
          </div>
        )}

        <div
          onClick={() => togglePath("/profile")}
          className="relative flex items-center gap-1.5 cursor-pointer"
        >
          <Link href={`/profile/${user?._id}`}>
            <p
              className={`${currentPath === "/profile" ? "text-blue-500" : ""}`}
            >
              <LuUser2></LuUser2>
            </p>
          </Link>
          {currentPath === "/profile" && (
            <span className="absolute bottom-0 left-0 w-full h-1"></span>
          )}
        </div>
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
                } border rounded-lg hover:bg-gray-200 duration-150 shadow-lg`}
              >
                <div
                  className="p-2 cursor-pointer  text-red-400 ml-2 "
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

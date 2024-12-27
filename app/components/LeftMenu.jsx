"use client";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import Link from "next/link";

const LeftMenu = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const user = useSelector((state) =>state.user.user)

  return (
    <div className="flex flex-col gap-6">
     <div
        className={`flex flex-col items-center rounded-md h-40 shadow-md transition-colors duration-300 relative
        ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
      
        <div className="w-full h-20 rounded-md overflow-hidden">
          <img
            src={
              user.coverPhoto ||
               "https://images.rawpixel.com/image_social_landscape/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjU0NmJhdGNoMy1teW50LTM0LWJhZGdld2F0ZXJjb2xvcl8xLmpwZw.jpg"
            }
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-26 transform translate-y-1/2">
        <Link href={`/profile/${user._id}`}>
          <img
            src={
              user.profilePhoto ||
             "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="Profile Photo"
            className="w-16 h-16 cursor-pointer rounded-full object-cover border border-white "
          />
          </Link>
        </div>
        
        <Link  href={`/profile/${user._id}`}>
        <div className="mt-6 gap-1 cursor-pointer flex text-center">
          <p className="text-md font-semibold">{user.name || "User Name"}</p>
          <p className="text-md font-semibold">{user.surname || "User Name"}</p>
        </div>
        </Link>
        <div className="text-sm">Your profile</div>
      </div>
      <div
        className={`flex flex-col p-4 rounded-md shadow-md gap-4 transition-colors duration-300
        ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg text-gray-400 dark:text-gray-300">Sponsored Ads</p>
          <BsThreeDots className={`cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200`} />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            className="w-full h-40 object-cover"
            src="https://www.wcrf-uk.org/wp-content/uploads/2021/06/588595864r-LS.jpg"
            alt="Advertisement"
          />
        </div>
        <div className="flex items-center gap-4">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="https://assets.epicurious.com/photos/57c5c6d9cf9e9ad43de2d96e/master/pass/the-ultimate-hamburger.jpg"
            alt="BigChef Lounge"
          />
          <p className="text-blue-500 font-semibold">BigChef Lounge</p>
        </div>
        <div className="text-sm text-black dark:text-gray-600">
          It's an elite restaurant, serving gourmet dishes and providing top-tier service.
        </div>
        <div className="flex justify-center">
          <button
            className={`w-full text-center py-2 rounded-lg font-medium transition-colors duration-200 
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;

"use client";
import React from "react";
import { RxActivityLog } from "react-icons/rx";
import { SiMarketo } from "react-icons/si";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { IoAlbumsOutline } from "react-icons/io5";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlinePlayLesson } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

const LeftMenu = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);

  const menuItems = [
    { icon: <RxActivityLog />, label: "Activity" },
    { icon: <SiMarketo />, label: "Marketplace" },
    { icon: <MdOutlineEmojiEvents />, label: "Events" },
    { icon: <IoAlbumsOutline />, label: "Albums" },
    { icon: <LiaPhotoVideoSolid />, label: "Videos" },
    { icon: <IoNewspaperOutline />, label: "News" },
    { icon: <MdOutlinePlayLesson />, label: "Courses" },
    { icon: <IoListSharp />, label: "Lists" },
    { icon: <IoSettingsOutline />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`flex flex-col border rounded gap-4 p-6 shadow-md transition-colors duration-300 
        ${isDarkMode ? "text-white bg-gray-800 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}
      >
        <h2 className="text-xl font-semibold pb-2 border-b border-gray-300 dark:border-gray-600 mb-2">
          Menu
        </h2>
        <ul className="flex flex-col gap-3">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`
                flex items-center gap-3 text-sm font-medium p-2 rounded-md cursor-pointer transition-colors duration-200
                ${
                  isDarkMode
                    ? "hover:bg-white hover:text-black"
                    : "hover:bg-gray-300 hover:text-gray-800"
                }
              `}
            >
              {item.icon}
              <span className="flex-1">
                {item.label}{" "}
                <span className="text-xs text-gray-500">(not available)</span>
              </span>
            </li>
          ))}
        </ul>
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

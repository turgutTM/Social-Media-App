"use client";
import React from "react";
import { TfiGallery } from "react-icons/tfi";
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
import Link from "next/link";
import { useSelector } from "react-redux";

const LeftMenu = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);
  return (
    <div className="flex  flex-col gap-6">
      <div
        className={`flex ${
          isDarkMode ? "text-white bg-gray-800 " : "bg-white"
        } flex-col border rounded gap-6 p-6 shadow-md`}
      >
        <div className="flex gap-3 items-center">
          <RxActivityLog />
          <p>Activity</p>
        </div>
        <div className="flex gap-3 items-center ">
          <SiMarketo />
          <p>Marketplace</p>
        </div>
        <div className="flex gap-3 items-center">
          <MdOutlineEmojiEvents />
          <p>Events</p>
        </div>
        <div className="flex gap-3 items-center">
          <IoAlbumsOutline />
          <p>Albums</p>
        </div>
        <div className="flex gap-3 items-center">
          <LiaPhotoVideoSolid />
          <p>Videos</p>
        </div>
        <div className="flex gap-3 items-center">
          <IoNewspaperOutline />
          <p>News</p>
        </div>
        <div className="flex gap-3 items-center">
          <MdOutlinePlayLesson />
          <p>Courses</p>
        </div>
        <div className="flex gap-3 items-center">
          <IoListSharp />
          <p>Lists</p>
        </div>
        <div className="flex gap-3 items-center">
          <IoSettingsOutline />
          <p>Settings</p>
        </div>
      </div>
      <div
        className={`flex flex-col ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-3 shadow-md gap-4`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl text-gray-400">Sponsored Ads</p>
          <BsThreeDots className="cursor-pointer" />
        </div>
        <div>
          <img
            className="rounded-xl"
            src="https://www.wcrf-uk.org/wp-content/uploads/2021/06/588595864r-LS.jpg"
          ></img>
        </div>
        <div className="">
          <div className="flex items-center gap-4">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://assets.epicurious.com/photos/57c5c6d9cf9e9ad43de2d96e/master/pass/the-ultimate-hamburger.jpg"
            ></img>
            <p className="text-blue-500 font-semibold">BigChef Lounge</p>
          </div>
        </div>
        <div>
          It's an elite restaurant it's an elite restaurant it's an elite
        </div>
        <div className="flex justify-center">
          <button
            className={`${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-500"
            } p-2 w-full rounded-lg font-medium`}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Stories = () => {
  const isDarkMode = useSelector((state) => state.user.darkMode);

  return (
    <div
      className={`relative flex ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } gap-3 p-4 shadow-lg rounded-md`}
    >
      <div className="w-full flex justify-center">Stories is not active now</div>
     
    </div>
  );
};

export default Stories;

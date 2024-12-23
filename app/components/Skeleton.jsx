import React from "react";

const Skeleton = ({ type }) => {
  if (type === "feed") {
    return (
      <div className="flex flex-col gap-10 mb-28">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="w-12 h-3 bg-gray-200 rounded-lg"></div>
              <div className="w-20 h-3 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="h-3 w-6 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full h-5 bg-gray-200 rounded-lg"></div>
          <div className="w-full h-3 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-4 mt-14">
          <div className="w-32 h-9 bg-gray-200 rounded-full"></div>
          <div className="w-32 h-9 bg-gray-200 rounded-full"></div>
          <div className="w-32 h-9 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }
};

export default Skeleton;

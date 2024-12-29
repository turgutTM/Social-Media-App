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

  if (type === "profiledetail") {
    return (
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="w-14 h-5 rounded-lg bg-gray-200"></div>
          <div className="w-12 h-5 rounded-lg bg-gray-200"></div>
        </div>
        <div className="flex gap-3 mt-10 items-center">
          <div className="w-16 h-5 rounded-lg bg-gray-200"></div>
          <div className="w-32 h-5 rounded-lg bg-gray-200"></div>
        </div>
        <div className="mt-6 bg-gray-200 w-20 h-4 rounded-lg"></div>
        <div className="mt-6 bg-gray-200 w-32 h-7 rounded-lg"></div>
        <div className="mt-6 bg-gray-200 w-32 h-7 rounded-lg"></div>
        <div className="mt-6 bg-gray-200 w-32 h-7 rounded-lg"></div>
        <div className="mt-6 bg-gray-200 w-32 h-7 rounded-lg"></div>
        <div className="flex justify-between w-full">
          <div className="mt-10 bg-gray-200 w-32 h-4 rounded-lg"></div>
          <div className="mt-10 bg-gray-200 w-32 h-4 rounded-lg"></div>
        </div>
        <div className="mt-10 bg-gray-200 w-full h-4 rounded-lg"></div>
      </div>
    );
  }

  if (type === "chatprofile") {
    return (
      <div className="w-full p-1 flex flex-col ">
        <div className="w-fullmt-1 flex flex-col ">
          <div className=" w-full flex ">
            <div className="w-12 h-12 rounded-lg bg-gray-300"></div>
            <div className="flex flex-col ml-3 gap-2">
              <div className="w-12 h-4 rounded-lg bg-gray-300"></div>
              <div className="w-16 h-3 mt-3 rounded-lg bg-gray-300"></div>
            </div>
            <div className="bg-gray-300 w-8 h-3 rounded-md ml-[99px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "chatconv") {
    return (
      <div className="w-full p-1 mt-2 flex flex-col ">
        <div className="w-full flex gap-2 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="w-28 h-5 rounded-lg bg-gray-300"></div>
        </div>
        <div className="flex flex-col w-full mt-11">
          <div className="w-28  h-9 rounded-lg bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[24rem]"></div>
        </div>
      </div>
    );
  }

  
  if (type === "comment") {
    return (
      <div className="w-full items-center gap-2 p-1 mt-2 flex ">
       <div className="w-8 h-8 rounded-full bg-gray-300"></div>
       <div className="w-96 h-5 rounded-lg bg-gray-300"></div>
      </div>
    );
  }


  return null;
};

export default Skeleton;

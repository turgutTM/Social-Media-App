import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";

const DeleteUpdate = ({ onDelete, onUpdate }) => {
  return (
    <div className="flex flex-col absolute bg-white w-[9rem] left-0 -ml-[124px] gap-3 rounded-lg p-4 shadow-lg">
      <div className="flex gap-3 items-center" onClick={onDelete}>
        <MdDeleteOutline />
        <p className="cursor-pointer text-red-500 font-medium">Delete</p>
      </div>
      <div className="flex gap-3 items-center" onClick={onUpdate}>
        <RxUpdate />
        <p className="cursor-pointer text-blue-600 font-medium">Update</p>
      </div>
    </div>
  );
};

export default DeleteUpdate;

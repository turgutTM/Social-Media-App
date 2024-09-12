import ChatProfile from "../components/chat-profile";
import { useState } from "react";
import ChatConv from "../components/chat-conv";
import { useSelector } from "react-redux";
const ChatModal = ({ chatOpen }) => {
  if (!chatOpen) return null;
  const user = useSelector((state) =>state.user.user)
  const [selectedProfileId, setSelectedProfileId] = useState(user._id);
  const [selectedProfileData, setSelectedProfileData] = useState(null);

  return (
    <div className="fixed bottom-0 right-0 m-4 w-[50rem] h-[36rem] flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
      <div className="w-[28rem]">
        <ChatProfile
          setSelectedProfileId={setSelectedProfileId}
          selectedProfileId={selectedProfileId}
          setSelectedProfileData={setSelectedProfileData}
        ></ChatProfile>
      </div>
      <div className="w-full h-full">
        <ChatConv 
          selectedProfileId={selectedProfileId}
          selectedProfileData={selectedProfileData}
        ></ChatConv>
      </div>
    </div>
  );
};

export default ChatModal;

import ChatProfile from "../components/chat-profile";
import { useState, useEffect, useRef } from "react";
import ChatConv from "../components/chat-conv";
import { useSelector } from "react-redux";

const ChatModal = ({
  chatOpen,
  selectedFriend,
  initialMessage,
  handleToggleChat,
}) => {
  const modalRef = useRef(null);

  const user = useSelector((state) => state.user.user);
  const [selectedProfileId, setSelectedProfileId] = useState(
    selectedFriend ? selectedFriend._id : user._id
  );
  const [selectedProfileData, setSelectedProfileData] = useState(
    selectedFriend || null
  );

  useEffect(() => {
    if (selectedFriend) {
      setSelectedProfileId(selectedFriend._id);
      setSelectedProfileData(selectedFriend);
    }
  }, [selectedFriend]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleToggleChat(); 
      }
    };

    if (chatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatOpen, handleToggleChat]);

  if (!chatOpen) return null;

  return (
    <div
      className="fixed bottom-0 right-0 m-4 w-[50rem] h-[36rem] flex bg-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg"
      ref={modalRef}
    >
      <div className="w-[28rem]">
        <ChatProfile
          setSelectedProfileId={setSelectedProfileId}
          selectedProfileId={selectedProfileId}
          setSelectedProfileData={setSelectedProfileData}
        />
      </div>
      <div className="w-full h-full">
        <ChatConv
          selectedProfileId={selectedProfileId}
          selectedProfileData={selectedProfileData}
          initialMessage={initialMessage}
        />
      </div>
    </div>
  );
};

export default ChatModal;

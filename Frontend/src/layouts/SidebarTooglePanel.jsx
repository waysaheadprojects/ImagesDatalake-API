import React, { useRef } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../services/encrytion-decryption";

const MenuSection = ({ title, items }) => (
  <>
    <h2 className="text-base font-semibold mb-4">{title}</h2>
    <ul className="space-y-2 text-sm">
      {items.map(({ label, Icon, onClick }, index) => (
        <li
          key={index}
          className="flex items-center gap-2 cursor-pointer hover:rounded-md hover:bg-gray-300"
          onClick={onClick}
        >
          <Icon className="w-4 h-4" />
          {label}
        </li>
      ))}
    </ul>
  </>
);

const SidebarTogglePanel = ({ title, sections, historyList, navigate, onClose }) => {
  const timeoutRef = useRef(null);

  const handleMouseLeave = () => {
    // Set a delay of 2 seconds before calling onClose
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleMouseEnter = () => {
    // Clear the timeout if the user moves the mouse back in
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleHistoryClick = (session_id) => {
    const encryptedSessionId = encrypt(session_id);
    const urlSafeSessionId = encodeURIComponent(encryptedSessionId);
    navigate(`/images-ai/history?s=${urlSafeSessionId}`);
  };

  return (
      <div className="fixed top-0 left-[4%] min-h-screen w-56 bg-zinc-100 p-4 z-50 "onMouseLeave={onClose}
      >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">
          ✕
        </button>
      </div>
   
      {sections.map((section, idx) => (
        <div key={idx}>
          <MenuSection title={section.title} items={section.items} />
          {idx < sections.length - 1 && <hr className="my-4" />}
        </div>
      ))}

      {historyList?.length > 0 && (
        <>
          <hr className="my-4" />
          <span className="text-xs text-gray-500 mb-2">History</span>
          <div className="max-h-96 overflow-x-hidden overflow-y-auto">
            <ul className="space-y-2 text-sm">
              {historyList.map((item, index) => {
                const truncatedMessage =
                  item.last_message?.slice(0, 20) +
                  (item.last_message?.length > 20 ? "..." : "");

                return (
                  <li
                    key={index}
                    className="flex items-center gap-2 cursor-pointer hover:rounded-md hover:bg-gray-300"
                    onClick={() => handleHistoryClick(item.session_id)}
                  >
                    <BoltIcon className="w-4 h-4" />
                    <span
                      dangerouslySetInnerHTML={{ __html: truncatedMessage }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarTogglePanel;

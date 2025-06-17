import {
  GlobeAltIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import {
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import {
  BookOpenIcon,
  CpuChipIcon,
  FireIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";

import { useState } from "react";
import { POST_REQUEST } from "../../../api";
import { useNavigate } from "react-router-dom";
import { useQueryData, useResponse } from "../../../services/responsecontext";
import { encrypt } from "../../../services/encrytion-decryption";

const suggestions = [
  {
    icon: <FireIcon className="w-4 h-4 text-red-500" />,
    text: "Latest in fashion retail",
  },
  {
    icon: <CpuChipIcon className="w-4 h-4 text-blue-500" />,
    text: "Technology in retail",
  },
  {
    icon: <HeartIcon className="w-4 h-4 text-pink-500" />,
    text: "Most loved D2C brands",
  },
  {
    icon: <TrophyIcon className="w-4 h-4 text-yellow-500" />,
    text: "Retail Awards 2024?",
  },
];
const SearchBox = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const { setResponseData } = useResponse();
  const { setQuery } = useQueryData();

  function generateMixedUUID16() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uuid = "";
    for (let i = 0; i < 16; i++) {
      uuid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return uuid;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuery(data);
     let currentSessionId = sessionId;
  if (!currentSessionId) {
    currentSessionId = generateMixedUUID16();
    setSessionId(currentSessionId);
  }
    const payload = {
      question: data,
    };
    console.log(data);
    const response = await POST_REQUEST(
      "https://images-api.retailopedia.com/ask",
      payload,
      { session_id: currentSessionId }
    );
    setData("");
    console.log(response);
    if (response?.status==true) {
      setResponseData(response);
      setLoading(false);
    
    const encryptedSessionId = encrypt(currentSessionId);

 
    const urlSafeSessionId = encodeURIComponent(encryptedSessionId);

    navigate(`/images-ai/result?s=${urlSafeSessionId}`);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-[50px] text-center mb-2 font-medium">
            {/* Where <span className="font-semibold">knowledge</span> begins */}
            Images AI
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="relative  border   rounded-xl shadow-sm py-6 px-8">
              <textarea
                rows="3"
                value={data}
                placeholder="Ask anything..."
                onChange={(e) => setData(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="w-full resize-none border-none outline-none text-base pt-2 bg-neutral-50 placeholder:text-neutral-700"
              ></textarea>
              <div className="absolute bottom-4 left-4 flex space-x-2 bg-blue-50 border rounded-lg shadow-md">
                <button className="flex items-center gap-1 text-sm font-medium px-1 py-0.5 rounded-md bg-white text-blue-400 border border-blue-200 pl-1">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search
                </button>
                <button className="flex items-center gap-1 text-sm font-medium px-1 py-0.5 rounded-md  text-gray-500">
                  <BookOpenIcon className="w-5 h-5" />
                  Research
                </button>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                <PaperClipIcon className="w-5 h-5 text-gray-500" />
                <MicrophoneIcon className="w-5 h-5 text-gray-500" />
                <button
                  type="submit"
                  className="flex items-center justify-center bg-teal-600 text-white rounded-full w-9 h-9 hover:bg-teal-700"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
          {loading && (
            <div className="text-center my-5 flex items-center justify-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-gray-500 animate-spin" />
              <span className="text-sm italic">Thinking...</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {suggestions.map((tag) => (
              <button
                key={tag.text}
                className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-medium flex items-center gap-2 text-gray-500"
              >
                {tag.icon}
                <span>{tag.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 py-6 text-center text-xs text-gray-500 w-full max-w-2xl mx-auto text-base mb-4">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="javascript:void(0)" className="hover:underline">
            Pro
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Enterprise
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            API
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Blog
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Privacy
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Careers
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Store
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            Finance
          </a>
          <a href="javascript:void(0)" className="hover:underline">
            English
          </a>
        </div>
      </div>
    </>
  );
};

export default SearchBox;

import {
  GlobeAltIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { MicrophoneIcon } from "@heroicons/react/24/outline";
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
    icon: <img src="/images/5.png" alt="Fire" className="w-6 h-6" />,
    text: "Suggest brainstorming ideas to plan and execute IFF 2026.",
  },
  {
    icon: <img src="/images/1.png" alt="Fire" className="w-6 h-6" />,
    text: "Highlight Madhumita Mohanty’s appearances in Images Group’s ecosystem.",
  },
  {
    icon: <img src="/images/2.png" alt="Fire" className="w-6 h-6" />,
    text: " Explore how TRRAIN’s leadership has shaped India’s modern retail landscape through key industry platforms and forums.",
  },
  {
    icon: <img src="/images/3.png" alt="Fire" className="w-6 h-6" />,
    text: "Analyze the recurring themes, strategic perspectives, and industry-shaping insights articulated by Bhavesh Pitroda through his contributions, panels, and dialogues spanning multiple Images Group summits and sector forums.",
  },
  {
    icon: <img src="/images/4.png" alt="Fire" className="w-6 h-6" />,
    text: "Provide a detailed overview of PRC 2024, highlighting key themes, notable speakers, strategic discussions, and any significant industry outcomes that shaped the event.",
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
  const handleSubmit = async (e, questionText) => {
    e.preventDefault();
    setLoading(true);

    const queryText = questionText ?? data; // Use argument if provided, else fallback to state
    setQuery(queryText);

    let currentSessionId = sessionId;
    // if (!currentSessionId) {
    //   currentSessionId = generateMixedUUID16();
    //   setSessionId(currentSessionId);
    // }
    if (!currentSessionId) {
      currentSessionId = generateMixedUUID16();
      setSessionId(currentSessionId);

      // Store session creation timestamp in milliseconds
      sessionStorage.setItem("sessionCreatedAt", Date.now().toString());
    }

    const payload = {
      question: queryText,
    };

    console.log("Submitted question:", queryText);

    const response = await POST_REQUEST(
      "https://images-api.retailopedia.com/ask",
      payload,
      { session_id: currentSessionId }
    );

    setData("");
    console.log(response);

    if (response?.status == true) {
      setResponseData(response);
      setLoading(false);

      const encryptedSessionId = encrypt(currentSessionId);
      const urlSafeSessionId = encodeURIComponent(encryptedSessionId);
      navigate(`/images-ai/result?s=${urlSafeSessionId}`);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setQuery(data);
  //    let currentSessionId = sessionId;
  // if (!currentSessionId) {
  //   currentSessionId = generateMixedUUID16();
  //   setSessionId(currentSessionId);
  // }
  //   const payload = {
  //     question: data,
  //   };
  //   console.log(data);
  //   const response = await POST_REQUEST(
  //     "https://images-api.retailopedia.com/ask",
  //     payload,
  //     { session_id: currentSessionId }
  //   );
  //   setData("");
  //   console.log(response);
  //   if (response?.status==true) {
  //     setResponseData(response);
  //     setLoading(false);

  //   const encryptedSessionId = encrypt(currentSessionId);

  //   const urlSafeSessionId = encodeURIComponent(encryptedSessionId);

  //   navigate(`/images-ai/result?s=${urlSafeSessionId}`);
  //   }
  // };
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
          <div className="flex flex-wrap gap-2  mt-6">
            {/* {suggestions.map((tag) => (
  <button
    key={tag.text}
    type="button"
    onClick={(e) => {
      const selectedText = tag.text;
      setData(selectedText);
      handleSubmit(e, selectedText);
    }}
    className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-medium flex items-center gap-2 text-gray-500"
  >
    {tag.icon}
    <span>{tag.text}</span>
  </button>
))} */}

            <div className="flex flex-col gap-2">
              {suggestions.map((tag) => (
                <button
                  key={tag.text}
                  type="button"
                  onClick={(e) => {
                    const selectedText = tag.text;

                    // Apply the condition
                    let valueToSubmit;
                    if (
                      selectedText ===
                      "Highlight Madhumita Mohanty’s appearances in Images Group’s ecosystem."
                    ) {
                      valueToSubmit = "Who is Madhumita Mohanty";
                    } else if (
                      selectedText ===
                      "Suggest brainstorming ideas to plan and execute IFF 2026."
                    ) {
                      valueToSubmit =
                        "You are a senior strategic event analyst for Images Group. Your job: Analyze ALL relevant magazine archives, articles, speaker profiles, event reports, and post-event feedback for the India Fashion Forum (IFF) from the past 3–5 editions (e.g., IFF 2022–2025). Your mission: Deliver an actionable, evidence-based planning blueprint for the special IFF 2026 milestone edition — focusing on the theme, venue recommendation, audience mix, speakers, exhibitors, sponsorships, fireside chats, and session agenda ideas — using ONLY verifiable insights from the retrieved content. ✅ Your analysis MUST: Include factual details on past speakers, jury members, delegates, region/company breakdowns, top themes, keynotes, fireside chats, exhibitor brands, sponsor profiles, and any post-event feedback. Identify notable quotes, recurring topics, repeat attendees, and any new trends that can shape IFF 2026’s vision. Recommend fireside chat pairings and agenda ideas — who should speak with whom, on what topic, why — always grounded in historical context. Propose a venue strategy if location cues appear in past editions (city, format, venue type). Quote source file names, direct participant names, or phrases where relevant. If any point has no data, say so politely in the final output — do NOT assume or invent details. Structure the final output clearly in HTML only — use <div>, <h3>, <ul>, <p> only — no markdown, no raw SQL, no incomplete HTML. ✅ Your final output MUST include these sections (in this order): <h3>Key Trends and Insights</h3> <ul> <li>Recurring speakers, delegates, or jury members and companies.</li> <li>Region and industry breakdowns of past participants.</li> <li>Major sponsor brands, repeat exhibitors, or loyal partners.</li> <li>Quotes or phrases that reflect core positioning.</li> </ul> <h3>Recommended Core Theme and Venue Direction</h3> <ul> <li>central theme ideas for IFF 2026’s 25th Anniversaryli> <li>Ideal venue/city/type</li> </ul> <h3>Suggested Speakers, Delegates, Jury</h3> <ul> <li>Specific names or profiles to invite for 2026, with reason.</li> <li>Emerging voices or fresh companies that align with the new theme.</li> </ul> <h3>Recommended Exhibitors and Sponsorship Targets</h3> <ul> <li>Brands, categories, or partners that show strong repeat presence or gaps to target for expansion.</li> </ul> <h3>Fireside Chats and Session Agenda</h3> <ul> <li>Powerful fireside chat pairings — who should speak with whom, and why.</li> <li>High-impact fireside chat topics based on past interest.</li> <li>Ideas for broader session tracks that align with the milestone theme.</li> </ul> <h3>Next Steps for the IFF 2026 Team</h3> <ul> <li>Actionable recommendations for the planning team</li> </ul> ✅ Formatting & Delivery Rules: Final output must be minimum 500–1000 words, if enough data is found. Use only <div>, <h3>, <ul>, <p> — no markdown, no incomplete HTML. If data is missing for any section, say so politely within the HTML structure. Every point must stay factual, strategic, and usable — no assumptions. Goal: Deliver a credible, data-backed, strategic IFF 2026 blueprint that empowers the core team to plan a compelling, milestone India Fashion Forum edition that is relevant, influential, and future-ready — rooted in real insights from Images Group’s archives.";
                    } else {
                      valueToSubmit = selectedText;
                    }

                    setData(selectedText); // still set the original selected text if needed
                    handleSubmit(e, valueToSubmit); // pass the modified value
                  }}
                  className="text-sm w-full px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-medium flex items-center justify-start gap-2 text-gray-500 text-left"
                >
                  {tag.icon}
                  <span>{tag.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 py-6 text-center text-xs text-gray-500 w-full max-w-2xl mx-auto text-base mb-4">
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

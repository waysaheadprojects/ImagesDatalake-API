import { useEffect, useMemo, useState } from "react";
import { useQueryData, useResponse } from "../../../services/responsecontext";

import { POST_REQUEST } from "../../../api";
import questiongif from "../../../assets/images/question.gif";
import { useLocation } from "react-router-dom";
import "../style.css";

import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import renderAnswer from "./answerSection";
import renderImages from "./imageSection";
import renderVideos from "./videoSection";
import renderSources from "./sourcesSection";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResultaPageInputBox from "./result_page_input_box";
import { decrypt } from "../../../services/encrytion-decryption";
import InsightsPanel from "./insightPanel";

const websiteInsightStaging = [
  { name: "Zoho CRM", completed: 6000, pending: 0, inProgress: 0 },
  { name: "Mega Image", completed: 350, pending: 8, inProgress: 0 },
  { name: "S3 PDF", completed: 109, pending: 0, inProgress: 0 },
  { name: "NAS Drive", completed: 0, pending: 0, inProgress: 1 },
  { name: "India DB", completed: 0, pending: 0, inProgress: 1 },
  { name: "YouTube", completed: 2853, pending: 0, inProgress: 0 },
];

const ResultComponent = () => {
  const { responseData, setResponseData } = useResponse();
  const { query, setQuery } = useQueryData();

  const [data, setData] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("answer");
  const [history, setHistory] = useState([]);
 
  const [imageData, setImageData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [insightData, setInsightData] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 const location=useLocation()
  const encryptedSessionId = searchParams.get("s");
  const sessionId = encryptedSessionId ? decrypt(decodeURIComponent(encryptedSessionId)) : null;


  const tabList = useMemo(
    () => [
      { label: "answer", icon: ChatBubbleLeftRightIcon },
      { label: "images", icon: PhotoIcon },
      { label: "videos", icon: VideoCameraIcon },
      { label: "sources", icon: LinkIcon },
    ],
    []
  );

  const userId = sessionStorage.getItem("userId");
  const fetchExistingData = async () => {
    const response = await POST_REQUEST(
      "https://images-api.retailopedia.com/get-chat-history-detail",
      { session_id: sessionId, user_key: userId.toString() }
    );
    console.log(response?.data);
    setHistory(response?.data);
   
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (responseData && query) {
      setHistory((prev) => [...prev, { query, answer: typedAnswer }]);
    }

    setResponseData(null);
    setImageData([]);
    setVideoData([]);
    setSourceData([]);
    setInsightData([]);

    const payload = { question: data };
    const response = await POST_REQUEST(
      "https://images-api.retailopedia.com/ask",
      payload,
      { session_id: sessionId }
    );
    if (response.status === true) {
      setResponseData(response);
      setQuery(data);
    }

    setData("");
    setLoading(false);
  };

  const fetchSupplementaryData = (question, answer) => {
    POST_REQUEST("https://images-api.retailopedia.com/get_images", {
      question,
      answer,
    }).then(setImageData);
    POST_REQUEST("https://images-api.retailopedia.com/get_videos", {
      question,
    }).then(setVideoData);
    POST_REQUEST("https://images-api.retailopedia.com/get_sources", {
      question,
    }).then(setSourceData);
    POST_REQUEST("https://images-api.retailopedia.com/get_insights", {
      question,
      answer,
    }).then(setInsightData);
  };

  useEffect(() => {
    if (!query || !responseData?.answer) return;
    fetchSupplementaryData(query, responseData.answer);
  }, [query, responseData]);

  useEffect(() => {
    if (!responseData?.answer) return;

    setTypedAnswer("");
    let isCancelled = false;
    const answer = responseData.answer;

    const typeText = async () => {
      for (let i = 0; i < answer.length; i++) {
        if (isCancelled) return;
        setTypedAnswer((prev) => prev + answer[i]);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    };

    typeText();
    return () => {
      isCancelled = true;
    };
  }, [responseData]);

  useEffect(() => {
    fetchExistingData();
  }, [location.search]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "answer":
        return renderAnswer({ typedAnswer: typedAnswer });
      case "images":
        return renderImages({ imageData: imageData });
      case "videos":
        return renderVideos({ videoData: videoData });
      case "sources":
        return renderSources({ sourceData: sourceData });
      default:
        return null;
    }
  };
  useEffect(() => {
    if (!sessionId) {
      navigate("/images-ai");
    }
  }, [sessionId, navigate]);

  return (
    <div className="flex h-[90vh] w-full overflow-hidden">
     
      <div className="w-[70%] flex flex-col justify-between p-4">
     
        <div className="flex-1 overflow-y-auto pr-6 ml-16">
  
          {history?.map((item, index) => (
            <div key={index} className="text-left mb-6 border-b pb-4">
              <h2 className="text-xl font-bold mb-4 text-left">{item.query}</h2>
              <div className="max-w-screen-lg flex justify-start gap-8 border-b border-gray-300 mb-4">
                <button
                  className="pb-2 flex items-center gap-2 text-sm border-b-2 border-black font-semibold text-black capitalize"
                  disabled
                >
                  <ChatBubbleLeftRightIcon
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                  Answer
                </button>
              </div>
              <div
                className="prose prose-sm max-w-none answer"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          ))}

   
          {responseData && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={questiongif}
                    alt="image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-left">{query}</h2>
              </div>

              <div className="max-w-screen-lg flex justify-start gap-8 border-b border-gray-300 mb-4">
                {tabList.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`pb-2 flex items-center gap-2 text-sm transition-all duration-200 capitalize ${
                        activeTab === tab.label
                          ? "border-b-2 border-black font-semibold text-black"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 text-left">{renderTabContent()}</div>
            </>
          )}
        </div>

       
        <div className="mt-4 flex justify-center">
          <ResultaPageInputBox
            handleSubmit={handleSubmit}
            loading={loading}
            data={data}
            setData={setData}
            responseData={responseData}
          />
        </div>
      </div>

      
      <div className="w-[30%] h-full p-4 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Insights</h3>
        <InsightsPanel/>
        {/* <div style={{ width: "400px", height: 300 }}>
          {" "}
         
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={websiteInsightStaging}>
              <XAxis
                dataKey="name"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#4ade80" name="Completed" />
              <Bar dataKey="pending" fill="#facc15" name="Pending" />
              <Bar dataKey="inProgress" fill="#60a5fa" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
};

export default ResultComponent;

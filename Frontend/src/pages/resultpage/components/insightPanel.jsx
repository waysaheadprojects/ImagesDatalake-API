import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function InsightsPanel() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedSections, setExpandedSections] = useState({
    Anomalies: true,
    Trends: true,
    KPI: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
const sectionIcons = {
  Anomalies: "🚨",
  Trends: "📉",
  KPI: "📊",
};

  const insights = {
    Anomalies: [
      {
        title: "Recent anomaly in Files",
        description: (
          <>
            The most recent Files anomaly was in{" "}
            <span className="text-blue-700 font-medium">April 2023</span>, when{" "}
            <span className="text-blue-700 font-medium">IMAGES</span> had a high of{" "}
            <span className="font-medium">22,255</span>.
          </>
        ),
      },
      {
        title: "Anomalies in Files",
        description: (
          <>
            Files had several high anomalies between{" "}
            <span className="text-blue-700 font-medium">January 2018</span> and{" "}
            <span className="text-blue-700 font-medium">April 2023</span>.
          </>
        ),
      },
      {
        title: "Significant anomaly in Files",
        description: (
          <>
            <span className="text-blue-700 font-medium">VIDEO</span> had the most significant Files anomaly, a high of{" "}
            <span className="font-medium">221</span> on{" "}
            <span className="text-blue-700 font-medium">January 2018</span>.
          </>
        ),
      },
    ],
    Trends: [
      {
        title: "Recent trends in Files",
        description: (
          <>
           Files for <span className="text-blue-700 font-medium">Images</span> started trending down on{" "}
            <span className="text-blue-700 font-medium">July 2022</span> falling by{" "}
            <span className="text-blue-700 font-medium">2.34% (296)</span> in{" "}
            <span className="text-blue-700 font-medium">9 quarters</span>.
          </>
        ),
      },
      {
        title: "Steep trend in Files",
        description: (
          <>
           Files for  <span className="text-blue-700 font-medium">Images</span> jumped from {" "}
          <span className="text-blue-700 font-medium">1,998</span> to {" "}
          <span className="text-blue-700 font-medium">11,754</span>{" "}
           during its steepest incline between {" "}
          <span className="text-blue-700 font-medium">April 2013</span> and{" "}
           <span className="text-blue-700 font-medium">January 2014</span>.
          </>
        ),
      },
      {
        title: "Long trends in Files",
        description: (
          <>
          <span className="text-blue-700 font-medium">PDF</span>{" "}
           experienced the longest period of decline in Files{" "}
            <span className="font-medium text-blue-700">(-768)</span> between{" "}
            <span className="text-blue-700 font-medium">July 2020</span> and{" "}
            <span className="text-blue-700 font-medium">April 2025</span> .
          </>
        ),
      },
    ],
    KPI: [
     {
  title: "Files analysis",
  description: (
    <>
      Overall Files is currently at{" "}
      <span className="font-medium">696,956</span>. Files for{" "}
      <span className="text-blue-700 font-medium">file_extension .jpg</span> and
      other segments are significantly higher than others.
    </>
  ),
},
{
  title: "Volume analysis",
  description: (
    <>
      Overall Volume is currently at{" "}
      <span className="font-medium">4,433,929,772,078</span>. Volume for{" "}
      <span className="text-blue-700 font-medium">file_extension .jpg</span> and
      other segments are significantly higher than others.
    </>
  ),
},
{
  title: "Current analysis",
  description: (
    <>
      Overall Current is currently at{" "}
      <span className="font-medium">289,084</span>. Current for{" "}
      <span className="text-blue-700 font-medium">week_of_year 5</span> and
      other segments are significantly higher than others.
    </>
  ),
},

    ],
  };

  return (
    <div className="w-full bg-gray-50 max-w-md  border rounded-md shadow-sm p-4">
      {/* Tab Switcher */}
      <div className="flex items-center border-b mb-4 space-x-4">
        {["Top", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Rendering */}
      {Object.entries(insights).map(([sectionName, cards]) => (
        <div key={sectionName} className="mb-4">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(sectionName)}
            className="flex items-center w-full text-left text-sm font-semibold text-gray-700 mb-2"
          >
            {expandedSections[sectionName] ? (
              <ChevronDown size={16} className="mr-1" />
            ) : (
              <ChevronRight size={16} className="mr-1" />
            )}
            {sectionName}
          </button>

          {/* Cards */}
          {expandedSections[sectionName] &&
            cards.map((item, index) => (
              <div
                key={index}
                className="p-3 mb-3  bg-white border border-gray-200 rounded-md"
              >
                <div className="flex items-start space-x-2">
                 <div className="text-blue-700 text-xl">{sectionIcons[sectionName] || "📈"}</div>

                  <div>
                    <div className="font-medium text-gray-800 mb-1">{item.title}</div>
                    <div className="text-sm text-gray-700">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

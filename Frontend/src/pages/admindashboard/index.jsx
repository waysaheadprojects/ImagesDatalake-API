// import { useState, useEffect } from "react";

// const AdminDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Optional: Set a timeout to prevent logo flash
//     const timer = setTimeout(() => setIsLoading(false), 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleIframeLoad = () => {
//     // Hide loader once iframe has fully loaded
//     setIsLoading(false);
//   };

//   return (
//     <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
//       {isLoading && (
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 10,
//           }}
//         >
//           <div className="loader">Loading...</div>
//         </div>
//       )}
//       <iframe
//         src="https://app.powerbi.com/view?r=eyJrIjoiOGYxYmMzZmEtM2EwNS00YWJlLWJmMDItYzQ1MjFhMWZhNGUyIiwidCI6IjMwNTgxZGY4LWMxMjAtNDNmZC1iZDFlLTk5ZDAzODEzMTFjMCIsImMiOjl9"
//         frameBorder="0"
//         allowFullScreen={true}
//         // onLoad={handleIframeLoad}
//         style={{
//           width: "100%",
//           height: "100%",
//           border: "none",
//         }}
//         title="Power BI Report"
//       />
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           width: "100%",
//           height: "100px", // Adjust height as needed
//           background: "#fff",
//           zIndex: 5,
//         }}
//       ></div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useState, useEffect } from "react";
import {
  MdOutlineDashboard,
  MdOutlineAnalytics,
  MdOutlineInsertChart,
  MdOutlineDataUsage,
  MdOutlineBarChart,
  MdPeopleOutline,
  MdOutlineShoppingCart,
  MdOutlineChat,
  MdOutlineMail,
  MdOutlineCalendarToday,
  MdOutlineContactMail,
  MdOutlineViewKanban,
} from "react-icons/md";
import { GET_REQUEST } from "../../api";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const[chatHistory,setChatHistory]=useState([]);

const getHistory = async () => {
  try {
    const response = await GET_REQUEST("https://images-api.retailopedia.com/user-chat-history", {
      role: "user",
    });

    if (response?.chats && Array.isArray(response.chats)) {
      // Sort by `created_at` in descending order
      const sortedChats = response.chats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Take only the top 10 entries
      const topTenChats = sortedChats.slice(0, 10);

      // Set state
      setChatHistory(topTenChats);
    } else {
      setChatHistory([]); // fallback if chats is missing
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
};

useEffect(() => {
  const fetchHistory = async () => {
    await getHistory();
  }
  fetchHistory()
}, []);


// useEffect(() => {
//   const interval = setInterval(() => {
//     getHistory();
//   }, 5000); // 2000 ms = 2 seconds

//   // Cleanup interval on component unmount
//   return () => clearInterval(interval);
// }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 8000);
    return () => clearTimeout(timer);
   
  }, []);



  return (
    <div className="w-screen h-screen overflow-hidden flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex-shrink-0 text-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <img src="/imagecompressedLogo.png" alt="ai" className="w-6 h-6" />
          <h2 className="text-xl text-purple-600">Images AI</h2>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Dashboard</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-purple-600 font-semibold bg-purple-100 p-2 rounded">
              <MdOutlineDashboard />
              Default
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineAnalytics />
              Analytics
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Widget</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineInsertChart />
              Statistics
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineDataUsage />
              Data
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineBarChart />
              Chart
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Application</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdPeopleOutline />
              Users
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineShoppingCart />
              Customer
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineChat />
              Chat
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineViewKanban />
              Kanban
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineMail />
              Mail
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineCalendarToday />
              Calendar
            </li>
            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <MdOutlineContactMail />
              Contact
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {isLoading && (
         <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
</div>

        )}

        {/* Table Section */}
     <div className="h-48 overflow-auto p-2 bg-white border-b border-gray-300">
  {/* <h3 className="text-sm font-semibold mb-2 text-gray-700">Chat History</h3> */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-sm font-semibold text-gray-700">Chat History</h3>
    <button
      onClick={getHistory}
      title="Refresh"
      className="text-gray-500 hover:text-gray-700 transition"
    >
      🔄
    </button>
  </div>
  <table className="min-w-full border border-gray-300 text-xs table-fixed">
    <thead>
  <tr className="bg-gray-100 text-gray-800">
    <th className="border border-gray-300 px-2 py-1 text-left w-4/6">Messages</th>
    <th className="border border-gray-300 px-2 py-1 text-left w-1/6">CreatedAt</th>
    <th className="border border-gray-300 px-2 py-1 text-left w-1/6">CreatedBy</th>
  </tr>
</thead>
<tbody>
  {chatHistory.map((chat, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td
        className="border border-gray-200 px-2 py-1 w-4/6 truncate"
        title={chat.message_text}
      >
        {chat.message_text}
      </td>
      <td className="border border-gray-200 px-2 py-1 w-1/6">{chat.created_at}</td>
      <td className="border border-gray-200 px-2 py-1 w-1/6">{chat.user_name}</td>
    </tr>
  ))}
</tbody>

  </table>
</div>


        {/* Iframe Section */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://app.powerbi.com/view?r=eyJrIjoiOGYxYmMzZmEtM2EwNS00YWJlLWJmMDItYzQ1MjFhMWZhNGUyIiwidCI6IjMwNTgxZGY4LWMxMjAtNDNmZC1iZDFlLTk5ZDAzODEzMTFjMCIsImMiOjl9"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full border-none"
            title="Power BI Report"
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "#fff",
            zIndex: 5,
          }}
        ></div>
      </div>
    </div>
  );
};

export default AdminDashboard;


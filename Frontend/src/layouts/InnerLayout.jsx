import {
  HomeIcon,
  PlusIcon,
  UserIcon,
  GlobeAltIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  BanknotesIcon,
  PaintBrushIcon,
  TrophyIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import imageLogo from "../assets/images/imagecompressedLogo.png";
import { Outlet, useNavigate } from "react-router-dom";
import { GET_REQUEST } from "../api";
import { useEffect, useState } from "react";
import SidebarHoverPanel from "./Sidebar";
const SidebarLayout = () => {
  const [historyList, setHistoryList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = sessionStorage.getItem("userId");
      const response = await GET_REQUEST(
        "https://images-api.retailopedia.com/user-chats",
        { user_key: userId }
      );
      console.log(response)
      if(response.status===true){
      setHistoryList(response.sessions);

      }
    };

    fetchHistory();
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // Sidebar menus
  const homeSections = [
    {
      title: "Home",
      items: [
        { label: "Finance", Icon: BookmarkIcon },
        { label: "Travel", Icon: PaperAirplaneIcon },
        { label: "Academic", Icon: BookOpenIcon },
      ],
    },
    {
      title: "Library",
      items: [
        {
          label: "Create a Thread",
          Icon: PlusIcon,
          onClick: () => navigate("/images-ai"),
        },
      ],
    },
  ];

  const discoverSections = [
    {
      title: "Discover",
      items: [
        { label: "Top", Icon: BookmarkIcon },
        { label: "Tech & Science", Icon: GlobeAltIcon },
        { label: "Finance", Icon: BanknotesIcon },
        { label: "Arts & Culture", Icon: PaintBrushIcon },
        { label: "Sports", Icon: TrophyIcon },
        { label: "Entertainment", Icon: FilmIcon },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-[4%_96%] min-h-screen bg-zinc-100 transition-[grid-template-columns] duration-300 ease-in-out overflow-hidden">
      <div className="mt-4">
        <div className="m-2 flex flex-col justify-between items-center py-4 h-screen">
          <div className="flex flex-col items-center space-y-6">
            <img src={imageLogo} alt="logo" className="w-12 h-12 mb-8" />

            {/* Add Thread */}
            <div className="relative group flex flex-col items-center">
              <button className="p-2 border mb-8 border-gray-300 hover:border-black text-gray-700 hover:text-black hover:bg-gray-300 rounded-full">
                <PlusIcon className="w-6 h-6" />
              </button>
              <SidebarHoverPanel
                title="Create"
                sections={homeSections}
                historyList={historyList}
                navigate={navigate}
              />
            </div>

            {/* Home */}
            <div className="relative group flex flex-col items-center">
              <button className="p-2 border-gray-300 hover:border-black text-gray-700 hover:text-black hover:rounded-md hover:bg-gray-300">
                <HomeIcon className="w-6 h-6" />
              </button>
              <span className="text-xs text-gray-600">Home</span>
              <SidebarHoverPanel
                title="Home"
                sections={homeSections}
                historyList={historyList}
                navigate={navigate}
              />
            </div>

            {/* Discover */}
            <div className="relative group flex flex-col items-center">
              <button className="p-2 border-gray-300 hover:border-black text-gray-700 hover:text-black hover:rounded-md hover:bg-gray-300">
                <GlobeAltIcon className="w-6 h-6" />
              </button>
              <span className="text-xs text-gray-600">Discover</span>
              <SidebarHoverPanel
                title="Discover"
                sections={discoverSections}
                navigate={navigate}
              />
            </div>
          </div>

          {/* Sign Out */}
          <div className="flex flex-col items-center space-y-1 mb-4">
            <button
              className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
              onClick={handleSignOut}
            >
              <UserIcon className="w-6 h-6" />
            </button>
            <span className="text-xs text-gray-700">Sign Out</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 border rounded-xl shadow-sm m-2 bg-neutral-50">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
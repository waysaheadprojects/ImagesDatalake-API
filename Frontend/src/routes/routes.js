import SidebarLayout from "../layouts/InnerLayout";
import Admin from "../pages/admin";
import AdminDashboard from "../pages/admindashboard";
import HistoryResultPage from "../pages/historypage";
import HomePage from "../pages/homepage";

import ResultPage from "../pages/resultpage";

import SearchPage from "../pages/searchpage";

import AdminAuthProvider from "../services/adminAuthProvider";

import AuthProvider from "../services/authprovider";

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin/dashboard",
    element:(
      <AdminAuthProvider>
        <AdminDashboard />
      </AdminAuthProvider>
    ) ,
  },
   {
    path: "/admin",
    element: <Admin />,
  },
   {
    path: "/images-ai/history",
      element: (
      <AuthProvider>
        <SidebarLayout />
      </AuthProvider>
    ),
     children: [
      {
        index: true,
        element: <HistoryResultPage />,
      },
    ]
  },

  {
    path: "/images-ai/result",
    element: (
      <AuthProvider>
        <SidebarLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <ResultPage />,
      },
    ],
  },
  {
    path: "/images-ai",
    element: (
      <AuthProvider>
        <SidebarLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
    ],
  },
];

export default routes;

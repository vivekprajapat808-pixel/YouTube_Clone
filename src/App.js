import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AppContext } from "./context/contextApi";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Feed from "./pages/Feed";
import SearchResult from "./pages/SearchResult";
import VideoDetails from "./pages/VideoDetails";
import ErrorComponent from "./shared/ErrorComponent";
import AuthModal from "./components/AuthModal";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <AuthModal />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorComponent />,
    children: [
      { path: "/", element: <Feed /> },
      { path: "/searchResult/:searchQuery", element: <SearchResult /> },
      { path: "/video/:id", element: <VideoDetails /> },
    ],
  },
]);

function App() {
  return (
    <AppContext>
      <AuthProvider>
        <div className="flex flex-col h-full">
          <RouterProvider router={appRouter} />
        </div>
      </AuthProvider>
    </AppContext>
  );
}

export default App;

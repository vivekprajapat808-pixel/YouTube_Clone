import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import YouTubee from "../assets/logo.PNG";
import YouTubeeMobile from "../assets/logo-colorfevicon.png";
import Profile from "../assets/profile.png";
import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import Fibell from "../assets/Fibell.png";
import { MdOutlineLightMode, MdDarkMode, MdLogout } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { DataContext } from "../context/contextApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../shared/Loader";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { loading, mobileMenu, setMobileMenu, theme, setTheme } =
    useContext(DataContext);
  const { currentUser, isAuthenticated, openAuthModal, logout } = useAuth();

  const navigate = useNavigate();

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const searchQueryHandler = (event) => {
    if (
      (event?.key === "Enter" || event === "searchButton") &&
      searchQuery?.length > 0
    ) {
      navigate(`/searchResult/${searchQuery}`);
    }
  };

  const searchQueryHandler2 = () => {
    if (searchQuery?.length > 0) {
      navigate(`/searchResult/${searchQuery}`);
    }
  };

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const mobileMenuToggle = () => {
    setMobileMenu(!mobileMenu);
  };

  // Do not show menu or leftNav for videoDetails page
  const { pathname } = useLocation();
  const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

  return (
    <div className="flex flex-row h-14 px-3 sm:px-4 md:px-5 justify-between items-center sticky top-0 z-20 bg-white dark:bg-black shadow-md">
      {loading && <Loader />}

      <div className="flex h-5 items-center">
        {pageName !== "video" && (
          <div
            onClick={mobileMenuToggle}
            className="flex h-10 w-10 justify-center items-center rounded-full md:hidden mr-1 sm:mr-2 cursor-pointer hover:bg-black/10 dark:hover:bg-[#303030]/[0.6]"
          >
            {mobileMenu ? (
              <CgClose className="text-black dark:text-white text-xl" />
            ) : (
              <SlMenu className="text-black dark:text-white text-xl" />
            )}
          </div>
        )}
        <Link to="/" className="flex h-10 items-center">
          <img
            src={YouTubee}
            alt="YouTubee"
            className="h-full hidden md:block"
          />
          <img
            src={YouTubeeMobile}
            alt="YouTubee"
            className="h-8 w-8 md:hidden rounded-full"
          />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="group flex items-center">
        <div className="flex h-8 md:h-10 ml-2 md:ml-10 md:pl-5 border border-[#404040] rounded-l-3xl group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:group-focus-within:pl-0">
          <div className="w-10 justify-center items-center hidden group-focus-within:md:flex">
            <IoIosSearch className="text-black/[0.7] dark:text-white text-xl" />
          </div>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={searchQueryHandler}
            className="w-28 sm:w-44 px-3 sm:px-5 bg-transparent outline-none text-black dark:text-white md:pl-0 md:group-focus-within:pl-0 md:w-64 lg:w-[500px] text-sm md:text-base"
          />
        </div>
        <button
          onClick={searchQueryHandler2}
          aria-label="Search"
          className="w-[36px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border border-l-0 border-[#404040] rounded-r-3xl bg-black/[0.1] dark:bg-white/[0.15]"
        >
          <IoIosSearch className="text-black/[0.9] dark:text-white text-xl" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center">
        {/* Notification Bell */}
        <div className="hidden md:flex justify-center items-center h-8 w-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors">
          <img src={Fibell} alt="Notifications" className="h-5 w-5" />
        </div>

        {/* Theme Switcher */}
        <div
          onClick={handleThemeSwitch}
          className="flex justify-center items-center ml-1 sm:ml-2 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-black/10 dark:hover:bg-[#303030]/[0.6] cursor-pointer transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <MdOutlineLightMode className="text-white text-xl" />
          ) : (
            <MdDarkMode className="text-[#3a5171] text-xl" />
          )}
        </div>

        {/* Auth Section */}
        {isAuthenticated && currentUser ? (
          <div className="relative ml-2 md:ml-4" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex h-8 w-8 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-blue-500 focus:outline-none transition-all cursor-pointer"
              aria-label="User menu"
            >
              <img
                src={currentUser.avatar || Profile}
                alt={currentUser.name}
                className="h-full w-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#282828] text-black dark:text-white rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 py-2 z-50 animate-fadeIn">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10">
                  <img
                    src={currentUser.avatar || Profile}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover bg-black/5 dark:bg-white/10"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                    <p className="text-xs text-black/60 dark:text-white/60 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="pt-2 pb-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 text-red-600 dark:text-red-400 font-medium transition-colors text-left"
                  >
                    <MdLogout className="text-lg" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal("signin")}
            className="flex items-center gap-1.5 sm:gap-2 border border-blue-500/80 hover:bg-blue-500/10 text-blue-500 text-xs sm:text-sm font-semibold py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full transition-colors ml-2 md:ml-3 whitespace-nowrap cursor-pointer"
          >
            <FaRegUserCircle className="text-base sm:text-lg" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;

import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import YouTubee from "../assets/logo.PNG";
import YouTubeeMobile from "../assets/logo-colorfevicon.png";
import Profile from "../assets/profile.png";
import { SlMenu } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import  Fibell from "../assets/Fibell.png";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { DataContext } from "../context/contextApi";
import Loader from "../shared/Loader";
import UseOnline from "../utils/UseOnline";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { loading, mobileMenu, setMobileMenu, theme, setTheme } =
    useContext(DataContext);

  const navigate = useNavigate();

  //custom hook for online/offline feature
  const isOnline = UseOnline();

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

  //I don't want to show menu or leftNav for videoDetails page. for that reason i fetch the path name and use it wisely for video router.
  const { pathname } = useLocation();
  const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

  return (
    <div className="flex flex-row h-14 px-4 md:px-5 justify-between items-center sticky top-0 z-20 bg-white dark:bg-black shadow-md">
      {loading && <Loader />}

      <div className="flex h-5 items-center">
        {pageName !== "video" && (
          <div
            onClick={mobileMenuToggle}
            className="flex h-10 w-10 justify-center items-center rounded-full  md:hidden md:mr-6 cursor-pointer hover:bg-[#303030]/[0.6]"
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

      <div className="group flex items-center">
        <div className="flex h-8 md:h-10 md:ml-10 md:pl-5 border border-[#404040] rounded-l-3xl group-focus-within:border-blue-500 md:group-focus-within:ml-5 md:group-focus-within:pl-0 ">
          <div className="w-10 justify-center items-center hidden group-focus-within:md:flex">
            <IoIosSearch className="text-black/[0.7] dark:text-white text-xl" />
          </div>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={searchQueryHandler}
            className="w-44 px-5 bg-transparent outline-none text-black dark:text-white md:pl-0 md:group-focus-within:pl-0 md:w-64 lg:w-[500px]"
          />
        </div>
        <button
          onClick={searchQueryHandler2}
          className="w-[40px] md:w-[60px] h-8 md:h-10 flex items-center justify-center border border-l-0 border-[#404040] rounded-r-3xl bg-black/[0.1] dark:bg-white/[0.15]"
        >
          <IoIosSearch className="text-black/[0.9] dark:text-white text-xl" />
        </button>
      </div>
      <div className="flex items-center">
        <div className="hidden md:flex">
          <div className="flex justify-center items-center h-5 w-5 rounded-full">
            <img
              src= {Fibell}
            />
          </div>
      
                    </div>
      <div className="flex items-center">
        <div className="hidden md:flex">
          
          <div
            onClick={handleThemeSwitch}
            className="flex justify-center items-center ml-2 h-10 w-10 rounded-full hover:bg-black/[0.2] dark:hover:bg-[#303030]/[0.6]"
          >
            {theme === "dark" ? (
              <MdOutlineLightMode className="text-white text-xl cursor-pointer" />
            ) : (
              <MdDarkMode className="text-[#3a5171] text-xl cursor-pointer" />
            )}
          </div>
        </div>
        <div className="flex h-8 w-8 overflow-hidden rounded-full md:ml-4">
        
          <img
            src= {Profile}
          />
       
          </div>
      </div>
    </div>
    </div>
  );
};

export default Header;

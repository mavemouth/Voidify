import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, UserButton, useUser } from "@clerk/react";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { credits, loadCreditsData } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
      setShowSignIn(false);
    } else {
      const hasClerkParam = window.location.search.includes("__clerk") || window.location.hash.includes("__clerk");
      if (hasClerkParam) {
        setShowSignIn(true);
      }
    }
  }, [isSignedIn]);

  const isLoading = !isLoaded || (isSignedIn && credits === false);

  return (
    <>
      <div className="flex items-center justify-between mx-4 py-3 lg:mx-44 ">
        <Link to="/">
          <img className="w-32 sm:w-44" src={assets.logo} alt="" />
        </Link>
        {isLoading ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-24 sm:w-32 h-9 sm:h-11 bg-blue-50 animate-pulse rounded-full"></div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 animate-pulse rounded-full"></div>
          </div>
        ) : isSignedIn ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate("/buy")} className="flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700">
              <img className="w-5" src={assets.credit_icon} alt="" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">Credits : {credits}</p>
            </button>
            <p className="text-gray-600 max-sm:hidden">Hi, {user.fullName}</p>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "flex items-center justify-center",
                  userButtonTrigger: "focus:shadow-none"
                }
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSignIn(true)}
            className="bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full"
          >
            Get Started{" "}
            <img className="w-3 sm:w-4" src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>

      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute -top-10 right-0 text-white text-xl font-bold"
            >
              ✕
            </button>
            <SignIn />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

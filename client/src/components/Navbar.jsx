import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { SignIn, UserButton, useUser } from "@clerk/react";
import { useEffect } from "react";

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }
  useEffect(() => {
    if (isSignedIn) {
      setShowSignIn(false);
    }
  }, [isSignedIn]);
  return (
    <>
      <div className="flex items-center justify-between mx-4 py-3 lg:mx-44 ">
        <Link to="/">
          <img className="w-32 sm:w-44" src={assets.logo} alt="" />
        </Link>
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonBox: "flex items-center justify-center",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          />
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

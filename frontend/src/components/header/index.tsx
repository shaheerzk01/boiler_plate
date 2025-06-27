"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, deleteUser } from "@/api/auth";

const Header = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTokenExists(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await logoutUser(token);
      } else {
        throw new Error("Token not found");
      }
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) throw new Error("User ID or token not found");

      // Ensure no premature cleanup
      console.log("Starting delete with token:", token);

      // Step 1: DELETE user
      const res = await deleteUser(userId, token);

      // Step 2: LOGOUT to blacklist token
      const logoutRes = await logoutUser(token);
      console.log("Logout result:", logoutRes);

      // Step 3: Clear everything and go to login
      localStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-blue-300 h-16 flex items-center px-4 text-black justify-between shadow-md z-50">
      <div className="font-bold text-xl">Boiler Plate</div>

      {tokenExists && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white text-black px-3 py-1 rounded shadow"
          >
            Profile
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border shadow rounded p-2 space-y-2 z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-500 hover:underline"
              >
                Logout
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left text-red-700 hover:underline"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

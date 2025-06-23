import React from "react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-blue-300 h-16 flex items-center px-4 text-black justify-center shadow-md z-50">
      <div className="flex items-center gap-2 font-bold text-xl">
        <span>Boiler Plate</span>
      </div>
    </header>
  );
};

export default Header

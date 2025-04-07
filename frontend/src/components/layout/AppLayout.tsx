import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MainNav from "./MainNav";
import { FaBars } from "react-icons/fa";

const AppLayout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`w-64 h-full ${isNavOpen ? 'block' : 'hidden'} md:block`}>
        <MainNav />
      </div>
      <div className="flex-1 overflow-auto">
      
      <div className="p-4 flex md:hidden">
          <button 
            className="flex items-center justify-center w-8 h-8"
            onClick={toggleNav}
            aria-label="Toggle navigation"
          >
            <FaBars size={24} />
          </button>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
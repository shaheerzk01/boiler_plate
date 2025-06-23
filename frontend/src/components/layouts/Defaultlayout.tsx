// components/layouts/DefaultLayout.tsx
"use client";

import React, { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";


interface LayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <div className="relative min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full h-16 z-50 bg-[#F4F7FA] shadow-md">
          <Header />
        </header>
  
        {/* Main Content */}
        <main className="pt-16 pb-16 bg-[#F4F7FA] h-screen">
          {children}
        </main>
  
        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-[#F4F7FA] shadow-md">
          <Footer />
        </footer>
      </div>
    );
  };
  

export default DefaultLayout;
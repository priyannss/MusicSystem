
import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <Link to="/" className="text-xl font-bold">
            MusiSync
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-10 flex items-center justify-center">
        <Outlet />
      </main>
      <footer className="p-4 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MusiSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;

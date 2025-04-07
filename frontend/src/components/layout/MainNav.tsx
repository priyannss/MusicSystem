import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Library, Search, Heart, PlusSquare, User, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import app from "@/components/auth/Firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      // Clear user from context
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-xl font-bold">MusiSync</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className={`nav-link ${isActive("/search") ? "active" : ""}`}
        >
          <Search size={20} />
          <span>Search</span>
        </Link>
        <Link
          to="/library"
          className={`nav-link ${isActive("/library") ? "active" : ""}`}
        >
          <Library size={20} />
          <span>Your Library</span>
        </Link>
        <div className="py-2"></div>
        <Link
          to="/liked"
          className={`nav-link ${isActive("/liked") ? "active" : ""}`}
        >
          <Heart size={20} />
          <span>Liked Songs</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <User size={20} className="mr-2" />
              <span>{user?.displayName || "Guest"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MainNav;
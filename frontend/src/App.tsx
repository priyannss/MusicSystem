
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { SongProvider } from "@/context/SongContext";

// Layouts
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

// App Pages
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import LikedSongsPage from "./pages/LikedSongsPage";
import CreatePlaylistPage from "./pages/CreatePlaylistPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <SongProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          
          {/* App Routes - Protected */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
            <Route path="/create-playlist" element={<CreatePlaylistPage />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </SongProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

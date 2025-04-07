import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MusicGrid from "@/components/MusicGrid";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  isLiked: boolean;
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const { user } = useAuth(); // Get current user from context

  // Updated search function implementation
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const modelResponse = await axios.post("http://localhost:5555/recommend", { song: searchQuery });
      // Assuming modelResponse.data.spotify_recommendations is an array of Song objects
      setSearchResults(modelResponse.data.spotify_recommendations);
    } catch (error) {
      console.error("Failed to search songs:", error);
    }
    setIsSearching(false);
  };

  // Debounce search whenever searchQuery changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleLiked = (songId: string) => {
    setSearchResults(
      searchResults.map((song) =>
        song.id === songId ? { ...song, isLiked: !song.isLiked } : song
      )
    );
  };

  const addLiked = async (songId: string) => {
      try {
        await axios.post("/api/setLikedSong", { songId, uid: user.uid });
        toggleLiked(songId);
        toast.success( "Added to your liked songs");
      } catch (error) {
        console.error("Failed to update liked status:", error);
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for songs, artists, or albums"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isSearching ? (
        <div className="py-10 text-center text-muted-foreground">
          Searching...
        </div>
      ) : searchQuery ? (
        <MusicGrid
          songs={searchResults}
          title={`Results for "${searchQuery}"`}
          emptyMessage="No results found"
          onLike={addLiked}
        />
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          Start typing to search for music
        </div>
      )}
    </div>
  );
};

export default SearchPage;
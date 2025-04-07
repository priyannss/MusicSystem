import React, { useState, useEffect } from "react";
import axios from "axios";
import MusicGrid from "@/components/MusicGrid";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  isLiked: boolean;
}

const LikedSongsPage = () => {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  
  // Fetch liked songs from backend
  const fetchLikedSongs = async () => {
    if (user && user.uid) {
      try {
        const response = await axios.post(`/api/getLikedSongs`, { uid: user.uid });

        const mappedSongs = response.data.likedSongs.map((song: any) => ({
          id: song.spotifyId,
          title: song.title,
          artist: song.artist,
          coverUrl: song.coverImage,
          isLiked: true,
        }));
        
        setLikedSongs(mappedSongs);
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
      }
    }
  };
  
  useEffect(() => {
    fetchLikedSongs();
  }, [user]);
  
  // Handle unliking a song (also optionally send update to backend)
  const handleUnlike = async (songId: string) => {
    try {
      if (user && user.uid) {
        await axios.post("/api/removeLikedSong", { songId, uid: user.uid });
        toast.success("removed from liked songs");
      }
    } catch (error) {
      console.error("Failed to remove liked song:", error);
    }
    fetchLikedSongs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Liked Songs</h1>
        <p className="text-muted-foreground">{likedSongs.length} songs</p>
      </div>

      <MusicGrid
        songs={likedSongs}
        onLike={handleUnlike}
        emptyMessage="Songs you like will appear here"
      />
    </div>
  );
};

export default LikedSongsPage;
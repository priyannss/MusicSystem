import React, { useState, useEffect } from "react";
import PlaylistGrid from "@/components/PlaylistGrid";
import MusicGrid from "@/components/MusicGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  isLiked: boolean;
}

const LibraryPage = () => {
  const { user } = useAuth();
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

  // Fetch recently played songs from backend
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      if (user && user.uid) {
        try {
          const response = await axios.post("/api/getRecentlyPlayed", {
            uid: user.uid,
          });
          console.log(response.data.recentlyPlayed);
          
          // Assuming your backend returns an array of songs on response.data.recentSongs
          const mappedSongs = response.data.recentlyPlayed.map((song: any) => ({
            id: song.spotifyId,
            title: song.title,
            artist: song.artist,
            coverUrl: song.coverImage,
            isLiked: song.isLiked || false,
          }));
          setRecentlyPlayed(mappedSongs);
        } catch (error) {
          console.error("Failed to fetch recently played songs:", error);
        }
      }
    };

    fetchRecentlyPlayed();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Listening History</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <MusicGrid
            songs={recentlyPlayed}
            title="Recently Played"
            emptyMessage="Your listening history will appear here"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryPage;
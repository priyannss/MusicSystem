import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import MusicGrid from "@/components/MusicGrid";
import { useAuth } from "@/context/AuthContext"; // Import user info from context
import { toast } from "sonner";
import { SongContext } from "@/context/SongContext";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  isLiked: boolean;
}

const Dashboard = () => {
  const { user } = useAuth(); // Get current user from context
  // Recommended songs fetched from backend
  const { recommendedSongs } = useContext(SongContext);
  const [allSongs, setAllSongs] = useState<Song[]>([]);

    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

    const fetchRecentlyPlayed = async () => {
      if (user && user.uid) {
        try {
          const response = await axios.post("/api/getRecentlyPlayed", {
            uid: user.uid,
          });
          
          // Assuming your backend returns an array of songs on response.data.recentSongs
          const mappedSongs = response.data.recentlyPlayed.map((song: any) => ({
            id: song.spotifyId,
            title: song.title,
            artist: song.artist,
            coverUrl: song.coverImage,
            isLiked: song.isLiked || false,
          }));
          setRecentlyPlayed(mappedSongs.slice(0, 5)); // Limit to 10 songs
        } catch (error) {
          console.error("Failed to fetch recently played songs:", error);
        }
      }
    };

    useEffect(() => { 
      fetchRecentlyPlayed();
    }
    , [user]);
  

  // Fetch recommended songs from backend and map _id to id and coverImage to coverUrl
  const fetchAllSongs = async () => {
    try {
      const response = await axios.get("/api/getAllSongs");

      const mappedSongs = response.data.songs.map((song: any) => ({
        id: song.spotifyId,
        title: song.title,
        artist: song.artist,
        coverUrl: song.coverImage,
        isLiked: song.isLiked || false,
      }));

      setAllSongs(mappedSongs);
    } catch (error) {
      console.error("Failed to fetch recommended songs:", error);
    }
  };

  useEffect(() => {
    fetchAllSongs();
  }, []);


  const addLiked = async (songId: string) => {
    // Determine the new liked value based on the current status in recommendedSongs
    const targetSong = allSongs.find((song) => song.id === songId);
    const newIsLiked = targetSong ? !targetSong.isLiked : false;

    const updatedSongs = allSongs.map((song) =>
      song.id === songId ? { ...song, isLiked: newIsLiked } : song
    );
    setAllSongs(updatedSongs);

    // Send update to backend if user is logged in
    if (user && user.uid) {
      try {
        await axios.post("/api/setLikedSong", { songId, uid: user.uid });
        toast.success( "Added to your liked songs");
      } catch (error) {
        console.error("Failed to update liked status:", error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Welcome {user?.displayName || "Guest"}</h1>
        </div>
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Discover your daily music mix
          </h2>
          <p className="text-muted-foreground mb-4">
            Personalized songs picked just for you, based on your listening history
          </p>
        </div>
      </section>

      <section>
        <MusicGrid
          songs={allSongs}
          title="Featuring songs you might like"
          onLike={addLiked}
        />
      </section>

      <section>
        <MusicGrid
          songs={recentlyPlayed}
          title="Recently played"
          onLike={addLiked}
        />
      </section>

      <section>
        <MusicGrid
          songs={recommendedSongs}
          title="Recommended songs"
          onLike={addLiked}
        />
      </section>
    </div>
  );
};

export default Dashboard;
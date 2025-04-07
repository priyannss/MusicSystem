
import React from "react";
import MusicCard from "./MusicCard";
import { useToast } from "@/hooks/use-toast";

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  isLiked?: boolean;
}

interface MusicGridProps {
  songs: Song[];
  title?: string;
  emptyMessage?: string;
  onLike?: (songId: string) => void;
  onPlay?: (songId: string) => void;
}

const MusicGrid: React.FC<MusicGridProps> = ({
  songs,
  title,
  emptyMessage = "No songs found",
  onLike,
  onPlay,
}) => {
  const { toast } = useToast();

  const handlePlay = (songId: string) => {
    if (onPlay) {
      onPlay(songId);
    } else {
      const song = songs.find((s) => s.id === songId);
      if (song) {
        toast({
          title: "Now Playing",
          description: `${song.title} by ${song.artist}`,
        });
      }
    }
  };

  const handleLike = (songId: string) => {
    if (onLike) {
      onLike(songId);
    } else {
      const song = songs.find((s) => s.id === songId);
      if (song) {
        toast({
          title: song.isLiked ? "Removed from Liked Songs" : "Added to Liked Songs",
          description: `${song.title} by ${song.artist}`,
        });
      }
    }
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {songs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {songs.map((song) => (
            <MusicCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              coverUrl={song.coverUrl}
              isLiked={song.isLiked}
              onPlay={() => handlePlay(song.id)}
              onLike={() => handleLike(song.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default MusicGrid;

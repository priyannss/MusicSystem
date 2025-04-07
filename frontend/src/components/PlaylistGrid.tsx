
import React from "react";
import PlaylistCard from "./PlaylistCard";
import { useToast } from "@/hooks/use-toast";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  songCount: number;
}

interface PlaylistGridProps {
  playlists: Playlist[];
  title?: string;
  emptyMessage?: string;
  onPlay?: (playlistId: string) => void;
  onMenu?: (playlistId: string) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
  title,
  emptyMessage = "No playlists found",
  onPlay,
  onMenu,
}) => {
  const { toast } = useToast();

  const handlePlay = (playlistId: string) => {
    if (onPlay) {
      onPlay(playlistId);
    } else {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (playlist) {
        toast({
          title: "Playing Playlist",
          description: playlist.name,
        });
      }
    }
  };

  const handleMenu = (playlistId: string) => {
    if (onMenu) {
      onMenu(playlistId);
    }
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              name={playlist.name}
              description={playlist.description}
              coverUrl={playlist.coverUrl}
              songCount={playlist.songCount}
              onPlay={() => handlePlay(playlist.id)}
              onMenu={() => handleMenu(playlist.id)}
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

export default PlaylistGrid;

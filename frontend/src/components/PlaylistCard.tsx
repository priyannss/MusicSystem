
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaylistCardProps {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  songCount: number;
  onPlay?: () => void;
  onMenu?: () => void;
}

const PlaylistCard = ({
  id,
  name,
  description,
  coverUrl,
  songCount,
  onPlay,
  onMenu,
}: PlaylistCardProps) => {
  return (
    <Card className="music-card group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={coverUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-primary hover:bg-primary/90 text-white"
            onClick={onPlay}
          >
            <Play fill="currentColor" size={16} />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {songCount} {songCount === 1 ? "song" : "songs"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={onMenu}
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;

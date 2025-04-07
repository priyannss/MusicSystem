import React, { createContext, useState, ReactNode } from "react";

export interface Song {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    isLiked: boolean;
}

interface SongContextType {
    recommendedSongs: Song[];
    setRecommendedSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}

export const SongContext = createContext<SongContextType>({
    recommendedSongs: [],
    setRecommendedSongs: () => {},
});

export const SongProvider = ({ children }: { children: ReactNode }) => {
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    return (
        <SongContext.Provider value={{ recommendedSongs, setRecommendedSongs }}>
            {children}
        </SongContext.Provider>
    );
};
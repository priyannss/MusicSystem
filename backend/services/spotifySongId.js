
import getAccessToken from "./getSpotifyToken.js";

const getSpotifyId = async (title, artist) => {
    const token = await getAccessToken();
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(title + " " + artist)}&type=track&limit=1`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();
    console.log(data);
    if (data.tracks.items.length > 0) {
        const song = data.tracks.items[0];
        return {
            spotifyId: song.id,
            duration: song.duration_ms / 1000, // Convert milliseconds to seconds
            album: song.album.name,
            coverImage: song.album.images[0]?.url || null, // Get album cover
        };
    }
    return null; // No song found
};
export default getSpotifyId;
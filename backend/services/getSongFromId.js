import getAccessToken from "./getSpotifyToken.js";
export const getSongFromId = async (id) => {
    const token = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}?market=IN`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log(data);
    if (!data.id) return null; 

    return {
        title: data.name,
        artist: data.artists.map(a => a.name).join(", "),
        album: data.album.name,
        coverImage: data.album.images[0]?.url || null,
        duration: data.duration_ms / 1000,
        previewUrl: data.preview_url||"Preview not available", // Spotify provides 30-sec previews
    };
}

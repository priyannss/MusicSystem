import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}`,
    });

    const data = await response.json();
    return data.access_token;
};
export default getAccessToken;
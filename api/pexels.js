import axios from "axios";

// Pexels API Key - hardcoded for now (should use env vars in production)
const API_KEY = "zTy1T3D8vhiT0ve3GTo6mdRUofQSxsGvA7zJMkGEAne0S9q86vXO8glv";

const client = axios.create({
  baseURL: "https://api.pexels.com/v1/",
  headers: {
    Authorization: API_KEY,
  },
});

export const getCuratedWallpapers = async (page = 1) => {
  try {
    const res = await client.get(`curated?per_page=30&page=${page}`);
    return res.data.photos;
  } catch (error) {
    console.error("Error fetching curated wallpapers:", error.response?.data || error.message);
    throw error;
  }
};

export const searchWallpapers = async (query, page = 1) => {
  try {
    const res = await client.get(
      `search?query=${query}&per_page=30&page=${page}`
    );
    return res.data.photos;
  } catch (error) {
    console.error("Error searching wallpapers:", error.response?.data || error.message);
    throw error;
  }
};

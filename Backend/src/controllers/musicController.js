const axios = require("axios");

const ITUNES_API = "https://itunes.apple.com";

// Format track response
const formatTrack = (track) => ({
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    coverImage: track.artworkUrl100,
    preview: track.previewUrl, // 30 sec preview
    duration: Math.floor(track.trackTimeMillis / 1000),
    genre: track.primaryGenreName,
    link: track.trackViewUrl,
});

// SEARCH MUSIC
const searchMusic = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const response = await axios.get(`${ITUNES_API}/search`, {
            params: { term: query, media: "music", limit: 20 },
        });

        res.status(200).json({
            message: "Music fetched successfully",
            music: response.data.results.map(formatTrack),
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch music", error: error.message });
    }
};

// GET ALL MUSIC (top hits)
const getAllMusic = async (req, res) => {
    try {
        const response = await axios.get(`${ITUNES_API}/search`, {
            params: { term: "top hits", media: "music", limit: 20 },
        });

        res.status(200).json({
            message: "Music fetched successfully",
            music: response.data.results.map(formatTrack),
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch music", error: error.message });
    }
};

// GET TRENDING MUSIC
const getTrendingMusic = async (req, res) => {
    try {
        const response = await axios.get(`${ITUNES_API}/search`, {
            params: { term: "trending 2024", media: "music", limit: 20 },
        });

        res.status(200).json({
            message: "Trending music fetched successfully",
            music: response.data.results.map(formatTrack),
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trending music", error: error.message });
    }
};

module.exports = {
    searchMusic,
    getAllMusic,
    getTrendingMusic,
};

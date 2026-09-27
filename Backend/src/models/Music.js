const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        artist: {
            type: String,
            required: true,
            trim: true
        },

        audioUrl: {
            type: String,
            required: true
        },

        coverImage: {
            type: String
        },

        genre: {
            type: String
        },

        isTrending: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Music", musicSchema);
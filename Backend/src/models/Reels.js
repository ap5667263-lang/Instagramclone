const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            maxlength: 2200
        },
        music: {
            id: { type: String },
            title: { type: String },
            artist: { type: String },
            coverImage: { type: String },
            preview: { type: String },
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                text: {
                    type: String,
                    maxlength: 1000
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        views: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reels", reelSchema);

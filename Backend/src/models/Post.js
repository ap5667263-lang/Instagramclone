const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Images / Videos
        media: [
            {
                url: {
                    type: String,
                    required: true
                },

                type: {
                    type: String,
                    enum: ["image", "video"],
                    required: true
                }
            }
        ],

        // Caption
        caption: {
            type: String,
            maxlength: 2200
        },

        // Hashtags
        hashtags: [
            {
                type: String
            }
        ],

        // Location
        location: {
            name: String
        },

        // Tagged users
        taggedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        // Music (embedded from iTunes)
        music: {
            id: { type: String },
            title: { type: String },
            artist: { type: String },
            coverImage: { type: String },
            preview: { type: String },
        },

        // Likes
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        // Saves
        saves: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        // Comments
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

        // Shares
        shares: {
            type: Number,
            default: 0
        },

        // Comment control
        commentsEnabled: {
            type: Boolean,
            default: true
        },

        // Post visibility
        visibility: {
            type: String,
            enum: ["public", "followers"],
            default: "public"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);
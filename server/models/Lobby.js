const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LobbySchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId, // This links to a User's unique ID
        ref: 'User', // Specifically, the ID from the 'User' model
        required: true
    },
    game: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    players: [{ // This is an array of users who are in the lobby
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxPlayers: {
        type: Number,
        default: 5,
        required: true
    },
    isPrivate: {
    type: Boolean,
    default: false
    },
    password: { 
        type: String,
        required: function() { return this.isPrivate; } // Required only if lobby is private
    },
    inviteCode: {
    type: String,
    required: true,
    unique: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Lobby', LobbySchema);
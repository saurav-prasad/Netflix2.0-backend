const mongoose = require('mongoose');
const { Schema } = mongoose

const userWishList = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "netflix-user"
    },
    trailerId: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    name: String,
    overview: String,
    vote_average: String,
    release_date: String,
    backdrop_path: String,
    timeStamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('netflix-user-wishList', userWishList)

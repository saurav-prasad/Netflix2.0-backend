const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const WishList = require('../model/WishList')

// Route 1: fetch wishlists  => GET /api/wishlist/fetchwishlist
router.get('/fetchwishlist', fetchUser,
    async (req, res) => {
        try {
            const userId = await req.user.userId
            let data = await WishList.find({ user: userId })
            res.send({ data, status: true })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)


// Route 2: add to wishlists  => POST /api/wishlist/addwishlist
router.post('/addwishlist', fetchUser,
    async (req, res) => {
        try {
            const { movieId, trailerId, name, overview, vote_average, release_date, backdrop_path } = req.body
            const userId = req.user.userId
            let deleteData = await WishList.find({ movieId: movieId })
            if (deleteData) {
                await WishList.deleteMany({ movieId })
            }
            const data = new WishList({
                trailerId, movieId, name, overview, vote_average, release_date, backdrop_path, user: userId
            })
            await data.save()
            res.send({ status: true, message: "Saved to wishlist" })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)


// Route 3: delete from wishlists  => DELETE /api/wishlist/deletewishlist
router.delete('/deletewishlist/:movieid', fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.userId
            const id = req.params.movieid
            let data = await WishList.findOne({ movieId: id })
            if (!data) {
                return res.status(404).send({ message: "Video not found", success: false })
            }
            if (data.user.toString() !== userId) {
                return res.status(400).send({ message: "Action not allowed", status: false })
            }
            await WishList.findByIdAndDelete(data)
            res.send({ status: true, message: "Video deleted from wishlist" })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)
module.exports = router
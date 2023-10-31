const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const History = require('../model/History')

// Route 1: fetch history  => GET /api/history/fetchhistory
router.get('/fetchhistory', fetchUser,
    async (req, res) => {
        try {
            const userId = await req.user.userId
            let data = await History.find({ user: userId })
            // console.log(data);
            res.send({ data, status: true })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)


// Route 2: add to history  => POST /api/history/addhistory
router.post('/addhistory', fetchUser,
    async (req, res) => {
        try {
            const { trailerId, movieId, name, overview, vote_average, release_date, backdrop_path } = req.body
            const userId = req.user.userId

            let deleteData = await History.find({ movieId: movieId })
            if (deleteData) {
                await History.deleteMany({movieId})
            }
            const a = new History({
                movieId, trailerId, name, overview, vote_average, release_date, backdrop_path, user: userId
            })
            const savedHistory = await a.save()
            console.log(savedHistory);
            res.send({ status: true, data: savedHistory, message: "Saved to history" })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)


// Route 3: delete from history  => DELETE /api/history/deletehistory
router.delete('/deletehistory/:movieid', fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.userId
            const id = req.params.movieid
            let data = await History.findOne({ movieId: id })

            if (!data) {
                return res.status(404).send({ message: "Video not found", success: false })
            }
            if (data.user.toString() !== userId) {
                return res.status(400).send({ message: "Action not allowed", status: false })
            }
            await History.findByIdAndDelete(data)
            res.send({ status: true, message: "Video deleted from history" })
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error occured" })
        }
    }
)
module.exports = router
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db')
const app = express()
const port = 5000

// monogo connection
connectToMongo()

app.use(cors())
app.use(express.json())


// Available routes
// authentication routes
app.use('/api/auth',require('./routes/auth'))
// wishlist routes
app.use('/api/wishlist',require('./routes/wishlist'))
// history routes
app.use('/api/history',require('./routes/history'))

app.listen(port, (req, res) => {
    console.log("App listening at port", port);
})
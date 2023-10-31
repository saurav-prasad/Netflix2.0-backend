const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://saurav:18042003@netflixcluster.zonnj57.mongodb.net/?retryWrites=true&w=majority"
const connectToMongo = () => {
    mongoose.connect(mongoURI).
        then(() => { console.log("Connected to monogo..."); })
        .catch((err) => { console.log(err); })
}

module.exports = connectToMongo

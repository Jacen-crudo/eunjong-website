const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { 
    dbName: process.env.MONGODB_NAME
})
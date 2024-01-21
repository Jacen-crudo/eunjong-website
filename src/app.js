const express = require('express')
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routers/user')
const menuRouter = require('./routers/menu')

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(menuRouter)

module.exports = app
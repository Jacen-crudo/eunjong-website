const express = require('express')
const path = require('path')
require('./db/mongoose')
const userAPIRouter = require('./routers/userAPI')
const menuAPIRouter = require('./routers/menuAPI')

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userAPIRouter)
app.use(menuAPIRouter)

module.exports = app
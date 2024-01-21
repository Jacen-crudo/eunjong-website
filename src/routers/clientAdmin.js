const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

// POST ROUTES

// GET ROUTES

router.get('', auth)

// PATCH ROUTES

// DELETE ROUTES
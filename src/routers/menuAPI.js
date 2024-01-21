const express = require('express')
const sharp = require('sharp')
const Menu = require('../models/menu')
const auth = require('../middleware/auth')
const upload = require('../middleware/menu')
const router = new express.Router()

// POST ROUTES

router.post('/API/menu', auth, async (req, res) => {
    const menu = new Menu(req.body)

    try {
        await menu.save()
        res
            .status(201)
            .send({
                message: 'Menu item created!',
                data: menu
            })
    } catch (e) {
        res
        .status(400)
        .send({
            message: 'Could not add Menu Item!',
            error: e
        })
    }
})

router.post('/API/menu/:id/img', auth, upload.single('menu-item'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        const menu = await Menu.findById(req.params.id)

        if(!menu) return req.status(404).send()

        menu.image = buffer
        await menu.save()
        res.send()
    } catch (e) { res.status(500).send() }
}, (error, req, res, next) => {
    res
        .status(400)
        .send({
            message: 'Could not add Menu image!',
            error: error.message
        })
})

// GET ROUTES

router.get('/API/menu', async (req, res) => {
    const reqOptions = Object.keys(req.query)
    const reqFields = ['-_id', 'name', 'description', 'image', 'alt', 'flags']
    const reqSort = !req.query.sort ? ['-display'] : req.query.sort.split(' ')
    const allowedOptions = ['limit', 'skip', 'sort']
    const allowedSort = ['name', 'description', 'display']
    var isValidOp = reqOptions.every((option) => allowedOptions.includes(option))
    isValidOp = reqSort.every((sort) => allowedSort.includes(sort.replace('-', '')))
    
    if(!isValidOp) {
        return res
            .status(400)
            .send({
                error: 'Invalid search!',
                message: {
                    options: 'Allowed Options: ' + allowedOptions,
                    sort: 'Allowed Sort: ' + allowedSort
                }
            })
    }

    try {
        const data = await Menu
            .find({ flags: { $ne: 'disabled' } })
            .limit(req.query.limit)
            .skip(req.query.skip)
            .sort(reqSort.join(' '))
            .select(reqFields.join(' '))

        if(!data) return req.status(404).send()

        res.send({
            message: 'Search Success!',
            data
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/API/menu/:id', auth, async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id)

        if(!menu) return res.status(404).send()

        res.send({
            message: 'Menu Item found!',
            data: menu
        })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/API/menu/:id/img', async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id)

        if(!menu) return res.status(404).send()

        res.type('png')
        res.send(menu.image)
    } catch (e) {
        res.status(500).send()
    }
})

// PATCH ROUTES

router.patch('/API/menu/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'alt', 'display', 'flags']
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOp) {
        return res
            .status(400)
            .send({
                error: 'Invalid Updates!',
                message: 'Allowed Updates: ' + allowedUpdates
            })
    }

    try {
        const menu = await Menu.findById(req.params.id)

        if(!menu) return res.status(404).send()

        if(req.body.flags) {
            const flags = req.body.flags.split(' ')
            
            updates.splice(updates.indexOf('flags'), 1)

            if(!menu.flags) menu.flags = flags
            else {
                flags.every((flag) => {
                    if(menu.flags.includes(flag)) return menu.flags.splice(menu.flags.indexOf(flag), 1)
         
                    menu.flags.push(flag)
                 })
                
                if(menu.flags.length === 0) menu.flags = undefined
            }
        }

        updates.every(update => menu[update] = req.body[update])
        await menu.save()
        res.send()

    } catch (e) {
        res
            .status(400)
            .send({
                message: 'ERROR',
                error: e.message
            })
    }
})

// DELETE ROUTES

router.delete('/API/menu/:id/img', auth, async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id)

        if(!menu) return res.status(404).send()
        
        menu.image = undefined
        await menu.save()
        res.send()
    } catch(e) {
        res.status(500)
            .send({
                message: 'Could not remove menu item!',
                error: e
            })
    }
})

router.delete('/API/menu/:id', auth, async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id)

        if(!menu) return res.status(404).send()

        await Menu.deleteOne({ _id: menu._id})
        res.send()
    } catch(e) {
        res.status(500)
            .send({
                message: 'Could not remove menu item!',
                error: e
            })
    }
})

module.exports = router
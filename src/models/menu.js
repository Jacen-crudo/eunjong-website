const mongoose = require('mongoose')
const validator = require('validator')

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    alt: {
        type: String,
        trim: true
    },
    flags: {
        type: Array,
        default: undefined
    },
    display: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

// USER METHODS

menuSchema.methods.toJSON = function () {
    const menu = this
    const menuObject = menu.toObject()

    delete menuObject.image

    return menuObject
}

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu
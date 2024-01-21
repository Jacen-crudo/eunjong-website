const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png)$/)) return cb(new Error('Unsupported file type! Supported File Types: .png'))
        
        cb(undefined, true)
    }
})

module.exports = upload
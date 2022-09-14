const express = require('express');
const Note = require('../models/Note');
const multer = require('multer');
const auth = require('../middlewares/auth');
const router = new express.Router();
const noteController = require('../controllers/note');

const upload = multer({
    limits: 1700000,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide an image.'))
        }
        cb(undefined, true)
    }
})

// Create new task
router.post('/notes', auth, upload.single('media_file'), noteController.create);


module.exports = router;
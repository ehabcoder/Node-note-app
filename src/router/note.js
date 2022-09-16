const express = require('express');
const Note = require('../models/Note');
const multer = require('multer');
const auth = require('../middlewares/auth');
const router = new express.Router();
const noteController = require('../controllers/note');

// Multer for handling the file upoads.
const upload = multer({
    limits: 1700000,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide an image.'))
        }
        cb(undefined, true)
    }
})


// send note to user/users
/*
    Note: to use this end point you have to send the IDs for users
          you want to send the message to them in the a query variable
          like this:
          POST /notes?userIds=1,2,3
*/
router.post('/notes', auth, upload.single('media_file'), noteController.send);


/*
    Get list of notes for the last 30 days.
    The user could filter by the type, and could use pagination.
    So the requests will be like this:
    GET /notes?disabled=true
    GET /notes?limit=10&skip=0
*/
router.get('/notes', auth, noteController.list);

/*
    DELETE /notes/:noteId
    Soft delete a users' note
*/
router.delete('/notes/:noteId', auth, noteController.delete);

// Testing handlebars 
router.get('/', (req, res) => {
    res.render('main')
})

module.exports = router;
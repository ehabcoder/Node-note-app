const express = require('express')
const multer = require('multer')
const router = new express.Router()
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

const upload = multer({
    limits: 1600000,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide an image.'))
        }
        cb(undefined, true)
    }
})

// is email available?
router.post('/users/email', userController.emailAvailable)

// is signed in?
router.get('/users/signedin', auth, userController.signedin)

// Create user
router.post('/users/register', userController.register)

// login user
router.post('/users/login', userController.login)

// logout the user
router.post('/users/logout', auth, userController.logout)

// Get Current User
router.get('/users/me', auth, userController.me)

// Update User
router.patch('/users/me', auth, userController.update)

// Delete User
router.delete('/users/me', auth, userController.delete)


/// Uploading files routes

// uploading user's profile picture
router.post('/users/me/profilePic', auth, upload.single('profilePic'),
 userController.uploadProfilePic, (error, req, res, next) => {
    res.status(400).send({error: error.message});
 });

// deleting user's profile picture
router.delete('/users/me/profilePic', auth, upload.single('profilePic'),
 userController.deleteProfilePic, (error, req, res, next) => {
    res.status(400).send({error: error.message});
 })

// getting user's profile picture
router.get('/users/:id/profilePic', auth, userController.getProfilePic)

module.exports = router;
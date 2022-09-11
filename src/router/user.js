const express = require('express')
const router = new express.Router();

const userController = require('../controllers/user');
const auth = require('../middlewares/auth')

// Create user
router.post('/users/register', userController.register)

// login user
router.post('/users/login', userController.login)

// logout the user
router.post('/users/logout', auth, userController.logout)

module.exports = router;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');

exports.signedin = async (req, res) => {
    return res.status(200).send({authenticated: true});
}

exports.emailAvailable = async (req, res) => {
    try { 
        const user = await User.findOne({where: {email: req.body.email}});
        if(user) {
            return res.status(400).send({available: false})
        } else {
            return res.status(200).send({available: true})
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = await user.generateToken();
        res.status(201).send({user});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.authenticateUser(req.body.email, req.body.password);
        if(user) {
            const token = await user.generateToken();
            return res.status(200).json({user});
        } 
        else return res.status(404).json("Unable to connect");
    } catch (e) {
        res.status(400).send(e.message);
    }
}

exports.logout = async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
}

exports.me = async (req, res) => {
    res.send(req.user);
}

exports.update = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'profile_picture'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid fields to update!' })
    }
    
    try {
        const user = req.user;
        updates.forEach(update => user[update] = req.body[update]);
        if(updates.includes('password')) {
            user['password'] = await bcrypt.hash(user.password, 8);
        }
        // Check if email already exists if the user wanted to update it.
        const emails = await User.findAll({where: {email: user['email']}});
        if(emails.length >= 1) throw new Error('Email already exists.');

        // if everything is okay then save the user.
        await user.save();
        if (!user) return res.status(404).send();
        res.send({user, token: user.token});
    } catch (e) {
        res.status(400).send(e.message);
    }
}

exports.delete = async (req, res) => {
    try {
        await req.user.destroy();
        // TODO
        // sendRemoveEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

/// uploading profile pictures controller functions

// Uplaod profile picture
exports.uploadProfilePic = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.profile_picture = buffer;
    await req.user.save();
    res.send();
}

// Delete profile picuture
exports.deleteProfilePic = async (req, res) => {
    req.user.profile_picture = '';
    await req.user.save();
    res.send();
}

// Get profile picuture
exports.getProfilePic = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(!user || !user.profile_picture) throw new Error();
        res.set('Content-Type', 'image/png').send(user.profile_picture);
    } catch (e) {
        res.status(404).send()
    }
}
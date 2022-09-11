const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = await user.generateToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.authenticateUser(req.body.email, req.body.password);
        if(user) {
            const token = await user.generateToken();
            return res.status(200).json({user, token});
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
        console.log(e.message)
        res.status(500).send();
    }
}
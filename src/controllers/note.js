const Note = require('../models/Note');
const User = require('../models/User')
const sharp = require('sharp');
const { Op } = require('sequelize')
const moment = require('moment')

exports.send = async (req, res) => {
    try {
        if(!req.query.userIds) {
            return res.status(401).send(`Bad input! Please provide a userIds query parameter in the url.`)
        }
        const usersToSendTo_ids = req.query.userIds.split(',')
        const buffer = await sharp(req.file.buffer).resize({width: 255, height: 250}).png().toBuffer();
    
        for(let id of usersToSendTo_ids) {
            if(!await User.findOne({where: {id: parseInt(id)}})) {
                return res.status(401).send(`Bad input! No user with the id of ${id}`)
            }
        }

        usersToSendTo_ids.forEach(async (userId) => {
            await Note.create({
                ...req.body,
                owner: parseInt(userId),
                media_file: buffer,
                from: req.user.id
            })
        })
        res.status(201).send({
            message: `Note successfully sent to users with ids ${req.query.userIds}`
        });
    } catch (e) {
        console.log(e.message);
    }
}

exports.list = async (req, res) => {
    try {
        const userNotes = await req.user.getNotes({
            where: {
                disabled: req.query.disabled === 1,
                createdAt: {
                    [Op.gte]: moment().subtract(30, 'days').toDate()
                }
            },
            limit: parseInt(req.query.limit) | 100,
            offset: parseInt(req.query.skip) | undefined,
        });
        res.send(userNotes)
    } catch (e) {
        res.status(500).send(e.message);
    }
}
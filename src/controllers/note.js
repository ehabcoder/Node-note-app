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
        res.status(500).send(e)
    }
}

exports.sendWithEmail = async (req, res) => {
    try {
       const recieverUser = await User.findOne({where: { email: req.body.noteSenderEmails }});
       const note = {
        title: req.body.noteTitle,
        body: req.body.noteBody,
        note_type: req.body.noteDisabled
       }
       await Note.create({
        ...note,
        owner: recieverUser.id,
        from: req.user.id
       })
       res.status(201).send({
        message: `Note successfully sent to ${recieverUser.email}`
    });
    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.list = async (req, res) => {
    try {
        const userNotes = await req.user.getNotes({
            where: {
                // disabled: req.query.disabled === 1,
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

exports.getNote = async (req, res) => {  
    try {
        const noteId = req.params.id;
        if(!noteId) {
            throw new Error("please provide a valid note id.");
        }   
        const note = await Note.findOne({where: {id: noteId}});
        const sender = await User.findOne({where: {id: note.from}});
        const response = {
            noteId: note.id,
            noteTitle: note.title,
            noteBody: note.body,
            noteDisabled: note.disabled,
            noteOwnerName: req.user.name,
            noteOwnerEmail: req.user.email,
            noteSenderName: sender.name,
            noteSenderEmail: sender.email
        }
        if(note) return res.status(200).send(response);
        else throw new Error("No notes found with that id.")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

exports.delete = async (req, res) => {
    const noteId = req.params.noteId;
    if (!noteId) {
        return res.status(401).send("please provide a vaild note id in the params.")
    }
    try {
        const note_to_delete = await Note.findOne({where: {id: noteId}})
        if(req.user.id === note_to_delete.owner) {
            const deletedNote = await Note.destroy({
                where: {
                    id: noteId
                }
            })
            if (deletedNote) {
                res.send({message: 'Note deleted successfully.'})
            } else {
                res.status(401).send({error: "Something went wrong! Please try again later."})
            }
        } else {
            res.status(401).send({error: "You are not authorized to delete this note."})
        }
    } catch (e) {
        return res.status(500).send(e.message)
    }
}
const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');
const User = require('./User')
const NoteType = require('./Note_type');

const Note = sequelize.define('notes', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    media_file: {
        type: DataTypes.BLOB,
        allowNull: true,
        defaultValue: ''
    },
})

Note.hasOne(NoteType, {
    foreignKey: 'note_type'
})

module.exports = Note;
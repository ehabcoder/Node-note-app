const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');
const Note = require('./Note')

const NoteType = sequelize.define('types', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = NoteType;
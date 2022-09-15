const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');

const Note = sequelize.define('notes', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    from: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    media_file: {
        type: DataTypes.BLOB,
        allowNull: true,
        defaultValue: ''
    }
})


module.exports = Note;
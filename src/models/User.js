const sequelize = require('../db/sequelize');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const Note = require('./Note')

const User = sequelize.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: (value) => {
                if(!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            containPassword(value) {
                if(value.toLowerCase().includes('password')) {
                    throw new Error('Password connot contain "password"')
                }
            }
        }
    },
    token: {
        type: DataTypes.STRING,
        required: true
    },
    profile_picture: {
        type: DataTypes.BLOB,
        allowNull: true,
        defaultValue: '',
    }
})

User.hasMany(Note, {
    foreignKey: 'owner'
})


User.addHook('beforeCreate', async (user, options) => {
    if(await User.findOne({where: {email: user.email}})) {
        throw new Error('Email already used before.')
    }
    if(user.password) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

User.prototype.generateToken = async function () {
    const user = this;
    const token = jwt.sign({"id": user.id, "email": user.email}, process.env.JWT_SECRET)
    user.token = token;
    await user.save();
    return token;
}

// Authenticate the user
// We can regard it as a static method
User.authenticateUser = async (email, password) => {
    const user = await User.findOne({ where: {email} });
    if(user) {
        const password_valid = await bcrypt.compare(password, user.password);
        if(!password_valid) {
            throw new Error('Unable to login.')
        } 
    } else {
        throw new Error('Unable to login.')
    }
    return user;
}

module.exports = User;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql"
})

connect().catch(err => console.log("Unable to connect due to the error: ", err));

async function connect() { 
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
}

module.exports = sequelize;
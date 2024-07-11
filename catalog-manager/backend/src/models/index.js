const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: 41890,
    logging: console.log, // Adicione isso para verificar os logs
    dialectOptions: {
        connectTimeout: 10000 // Aumente o tempo limite, se necessário
    }
});

module.exports = sequelize;
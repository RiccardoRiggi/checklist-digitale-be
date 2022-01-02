const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    //database wide options
    var opts = {
        define: {
            //prevent sequelize from pluralizing table names
            freezeTableName: true
        }
    }


    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' }, opts);

    // init models and add them to the exported db object
    utenteModel = require('../utenti/utente.model');
    db.User = utenteModel(sequelize);

    // sync all models with database
    await sequelize.sync();
}
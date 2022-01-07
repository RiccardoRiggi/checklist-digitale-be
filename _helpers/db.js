const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;


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
    tRuolo = require('../truolo/truolo.model');
    db.tRuolo = tRuolo(sequelize);

    utenteModel = require('../utenti/utente.model');
    db.User = utenteModel(sequelize);

    db.tRuolo.hasMany(db.User); //COLLEGO LE DUE TAVOLE

    logAutenticazioneModel = require('../logAutenticazioni/logAutenticazioni.model');
    db.LogAutenticazione = logAutenticazioneModel(sequelize);

    logOperazioniModel = require('../logOperazioni/logOperazioni.model');
    db.LogOperazioni = logOperazioniModel(sequelize);

    tVeicolo = require('../tveicolo/tveicolo.model');
    db.tVeicolo = tVeicolo(sequelize);

    veicoliModel = require('../veicoli/veicoli.model');
    db.Veicoli = veicoliModel(sequelize);

    db.tVeicolo.hasMany(db.Veicoli); //COLLEGO LE DUE TAVOLE

    // sync all models with database
    await sequelize.sync();

    config.ruoli.forEach(element => {
        db.tRuolo.create(element);
    });

    utenteAdmin = config.utenteAdmin;
    const userTrovato = await db.User.findOne({ where: {email: utenteAdmin.email, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!userTrovato) {
        utenteAdmin.password=await bcrypt.hash(utenteAdmin.password, 10)
        await db.User.create(utenteAdmin);
    }   

    


}


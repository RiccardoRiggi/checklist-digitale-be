const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;


module.exports = db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    var opts = {
        define: {
            freezeTableName: true
        }
    }


    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' }, opts);

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

    checklistTemplateModel = require('../checklisttemplate/checklisttemplate.model');
    db.Checklistemplate = checklistTemplateModel(sequelize);

    db.Veicoli.hasMany(db.Checklistemplate);

    rigaChecklistTemplateModel = require('../rigachecklisttemplate/rigachecklisttemplate.model');
    db.RigaChecklistemplate = rigaChecklistTemplateModel(sequelize);

    db.Checklistemplate.hasMany(db.RigaChecklistemplate);

    checklistModel = require('../checklist/checklist.model');
    db.Checklist = checklistModel(sequelize);
    db.Veicoli.hasMany(db.Checklist);

    rigaChecklistModel = require('../rigachecklist/rigachecklist.model');
    db.RigaChecklist = rigaChecklistModel(sequelize);
    db.Checklist.hasMany(db.RigaChecklist);

    await sequelize.sync();

    //Inserisco i fuoli
    config.ruoli.forEach(element => {
        db.tRuolo.create(element);
    });

    //Inserisco i tipi veicolo
    config.veicoli.forEach(element => {
        db.tVeicolo.create(element);
    });

    //Inserisco un utente amministratore
    utenteAdmin = config.utenteAdmin;
    const userTrovato = await db.User.findOne({ where: { email: utenteAdmin.email, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!userTrovato) {
        utenteAdmin.password = await bcrypt.hash(utenteAdmin.password, 10)
        await db.User.create(utenteAdmin);
    }
}


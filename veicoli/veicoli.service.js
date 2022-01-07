const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Op = require('sequelize').Op;

//  Esporto le seguenti funzioni
module.exports = {
    
    getListaVeicoli,
    getVeicolo,
    inserisciVeicolo,
    aggiornaVeicolo,
    cancellaLogicamenteVeicolo
};

//  Funzione che restituisce la lista dei veicoli
async function getListaVeicoli() {
    return await db.Veicoli.findAll({ where: { dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo veicolo
async function getVeicolo(id) {
    const user = await db.Veicoli.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!user) throw 'Veicolo non trovato';
    return user;
}

//  Funzione che inserisce un nuovo veicolo
async function inserisciVeicolo(params) {

    if (await db.Veicoli.findOne({ where: { selettiva: params.selettiva , dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } })) {
        throw 'La selettiva "' + params.selettiva + '"è già stata registrata';
    }
    await db.Veicoli.create(params);
}

//  Funzione che aggiorna un veicolo
async function aggiornaVeicolo(id, params) {
    const user = await getVeicolo(id);

    const selettivaCambiata = params.selettiva && user.selettiva !== params.selettiva;
    if (selettivaCambiata && await db.Veicoli.findOne({ where: { selettiva: params.selettiva, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } })) {
        throw 'Selettiva "' + params.selettiva + '" già in uso';
    }

    Object.assign(user, params);
    await user.save();
    return user.get();
}

//  Funzione che cancella logicamente un veicolo
async function cancellaLogicamenteVeicolo(id, params) {
    const user = await getVeicolo(id);
    Object.assign(user, params);
    user.dateDelete=Date.now();
    await user.save();
    return user.get();
}

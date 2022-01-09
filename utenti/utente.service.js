const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Op = require('sequelize').Op;
const { compile } = require('joi');

//  Esporto le seguenti funzioni
module.exports = {
    autenticaUtente,
    getListaUtenti,
    getUtente,
    inserisciUtente,
    aggiornaUtente,
    cancellaUtente,
    cancellaUtenteLogicamente
};

//  Funzione che esegue l'autenticazione e genera il token JWT
async function autenticaUtente({ email, password }) {
    const utenteTrovato = await db.User.scope('withHash').findOne({ where: { email } });

    if (!utenteTrovato || !(await bcrypt.compare(password, utenteTrovato.password)))
        throw 'Email e/o password non corretta/e';

    utenteTrovato.password=undefined;    

    const token = jwt.sign({ sub: utenteTrovato.identificativo }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(utenteTrovato.get()), token };
}

//  Funzione che restituisce la lista degli utenti
async function getListaUtenti() {
    return await db.User.findAll({ where: { dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo utente
async function getUtente(id) {
    return await getUser(id);
}

//  Funzione che inserisce un nuovo utente
async function inserisciUtente(params) {

    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Indirizzo email "' + params.email + '" già utilizzato';
    }

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    await db.User.create(params);
}

//  Funzione che aggiorna un utente
async function aggiornaUtente(id, params) {
    const utenteTrovato = await getUser(id);

    const emailCambiata = params.email && utenteTrovato.email !== params.email;
    if (emailCambiata && await db.User.findOne({ where: { email: params.email, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } })) {
        throw 'Email "' + params.email + '" già in uso';
    }

    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(utenteTrovato, params);
    await utenteTrovato.save();

    return omitHash(utenteTrovato.get());
}

//  Funzione che cancella logicamente un utente dalla base dati
async function cancellaUtenteLogicamente(id, params) {
    const utenteTrovato = await getUser(id);
    Object.assign(utenteTrovato, params);
    utenteTrovato.dateDelete=Date.now();
    await utenteTrovato.save();
    return omitHash(utenteTrovato.get());
}

//  Funzione che cancella un utente dalla base dati
async function cancellaUtente(id) {
    const utenteTrovato = await getUser(id);
    await utenteTrovato.destroy();
}

//  Funzione che restituisce un utente non cancellato
async function getUser(id) {
    const utenteTrovato = await db.User.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!utenteTrovato) throw 'Utente non trovato';
    return utenteTrovato;
}

//  Funzione che omette gli HASH
function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}
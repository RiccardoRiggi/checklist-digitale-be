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
    const user = await db.User.scope('withHash').findOne({ where: { email } });
    console.log(user);
    console.log(password);
    console.log(user.password);

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Email e/o password non corretta/e';

    user.password=undefined;    

    const token = jwt.sign({ sub: user.identificativo }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
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

    console.log(params);

    await db.User.create(params);
}

//  Funzione che aggiorna un utente
async function aggiornaUtente(id, params) {
    const user = await getUser(id);

    const emailCambiata = params.email && user.email !== params.email;
    if (emailCambiata && await db.User.findOne({ where: { email: params.email, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } })) {
        throw 'Email "' + params.email + '" già in uso';
    }

    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

//  Funzione che cancella logicamente un utente dalla base dati
async function cancellaUtenteLogicamente(id, params) {
    const user = await getUser(id);
    Object.assign(user, params);
    user.dateDelete=Date.now();
    await user.save();
    return omitHash(user.get());
}

//  Funzione che cancella un utente dalla base dati
async function cancellaUtente(id) {
    const user = await getUser(id);
    await user.destroy();
}

//  Funzione che restituisce un utente non cancellato
async function getUser(id) {
    const user = await db.User.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!user) throw 'Utente non trovato';
    return user;
}

//  Funzione che omette gli HASH
function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}
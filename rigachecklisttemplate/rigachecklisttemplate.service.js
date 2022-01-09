const db = require('_helpers/db');
const Op = require('sequelize').Op;

//  Esporto le seguenti funzioni
module.exports = {
    
    getListaRigaChecklistTemplate,
    getRigaChecklistTemplate,
    inserisciRigaChecklistTemplate,
    aggiornaRigaChecklistTemplate,
    cancellaLogicamenteRigaChecklistTemplate
};

//  Funzione che restituisce la lista dei template riga
async function getListaRigaChecklistTemplate(id) {
    return await db.RigaChecklistemplate.findAll({ where: {checklistTemplateIdentificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
}

//  Funzione che restituisce un singolo template riga
async function getRigaChecklistTemplate(id) {
    const rigaTrovata = await db.RigaChecklistemplate.findOne({ where: {identificativo: id, dateDelete: { [Op.eq]: null } }, userDelete: { [Op.eq]: null } });
    if (!rigaTrovata) throw 'Riga Template non trovato';
    return rigaTrovata;
}

//  Funzione che inserisce un nuovo template riga
async function inserisciRigaChecklistTemplate(params,utente) {
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';
    await db.RigaChecklistemplate.create(params);
}

//  Funzione che aggiorna template riga
async function aggiornaRigaChecklistTemplate(id, params,utente) {
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';
    const rigaTrovata = await getRigaChecklistTemplate(id);
    Object.assign(rigaTrovata, params);
    await rigaTrovata.save();
    return rigaTrovata.get();
}

//  Funzione che cancella logicamente un template riga
async function cancellaLogicamenteRigaChecklistTemplate(id, params,utente) {
    if(utente.tRuoloCodice!='A')
        throw 'Accesso negato perché non disponi dei privilegi sufficienti';
    const rigaTrovata = await getRigaChecklistTemplate(id);
    Object.assign(rigaTrovata, params);
    rigaTrovata.dateDelete=Date.now();
    await rigaTrovata.save();
    return rigaTrovata.get();
}
